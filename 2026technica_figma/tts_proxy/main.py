import os
import re
import time
from collections import defaultdict, deque

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

DEFAULT_VOICE_ID = "IRHApOXLvnW57QJPQH2P"
WINDOW_SECONDS = 60
MAX_REQUESTS_PER_WINDOW = 20

app = FastAPI(title="Cstar ElevenLabs TTS", docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_origin_regex=r"https://([a-zA-Z0-9-]+\.)*(figma\.com|figma\.site)",
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
    max_age=600,
)

# Simple per-process throttling to reduce accidental repeated calls. For multi-instance
# deployments, replace this with a shared rate limiter.
_request_times: dict[str, deque[float]] = defaultdict(deque)


class SpeechRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)


def setting(name: str, fallback: float) -> float:
    try:
        value = float(os.getenv(name, ""))
    except (TypeError, ValueError):
        return fallback
    return max(0.0, min(1.0, value))


def check_rate_limit(client_ip: str) -> None:
    now = time.monotonic()
    events = _request_times[client_ip]
    while events and now - events[0] >= WINDOW_SECONDS:
        events.popleft()
    if len(events) >= MAX_REQUESTS_PER_WINDOW:
        raise HTTPException(status_code=429, detail="Too many narration requests. Please wait a minute.")
    events.append(now)


@app.get("/health")
async def health():
    return {"ok": True, "provider": "elevenlabs"}


@app.post("/speech")
async def speech(payload: SpeechRequest, request: Request):
    api_key = os.getenv("ELEVENLABS_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(status_code=503, detail="ElevenLabs is not configured.")

    text = " ".join(payload.text.split())
    if not text:
        raise HTTPException(status_code=400, detail="Narration text is empty.")

    origin = request.headers.get("origin")
    allowed_origin = (
        origin == "http://localhost:3000"
        or bool(origin and re.fullmatch(
            r"https://([a-zA-Z0-9-]+\.)*(figma\.com|figma\.site)", origin
        ))
    )
    if not allowed_origin:
        raise HTTPException(status_code=403, detail="This origin is not allowed.")

    client_ip = request.client.host if request.client else "unknown"
    check_rate_limit(client_ip)

    voice_id = os.getenv("ELEVENLABS_VOICE_ID", DEFAULT_VOICE_ID).strip() or DEFAULT_VOICE_ID
    output_format = os.getenv("ELEVENLABS_OUTPUT_FORMAT", "mp3_44100_128").strip()
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    body = {
        "text": text,
        "model_id": os.getenv("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2").strip(),
        "voice_settings": {
            "stability": setting("ELEVENLABS_STABILITY", 0.5),
            "similarity_boost": setting("ELEVENLABS_SIMILARITY_BOOST", 0.75),
            "style": setting("ELEVENLABS_STYLE", 0.0),
            "use_speaker_boost": os.getenv("ELEVENLABS_USE_SPEAKER_BOOST", "true").lower() != "false",
        },
    }

    try:
        async with httpx.AsyncClient(timeout=120) as client:
            upstream = await client.post(
                url,
                params={"output_format": output_format},
                headers={
                    "Accept": "audio/mpeg",
                    "Content-Type": "application/json",
                    "xi-api-key": api_key,
                },
                json=body,
            )
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Could not connect to ElevenLabs. Please try again.")

    if upstream.status_code >= 400:
        # Do not log visitor text, provider response bodies, or credentials.
        print(f"ElevenLabs narration request failed: HTTP {upstream.status_code}")
        status = upstream.status_code if upstream.status_code in (401, 429) else 502
        message = (
            "ElevenLabs rejected the API key." if upstream.status_code == 401
            else "ElevenLabs rate limit reached. Please try again shortly." if upstream.status_code == 429
            else "ElevenLabs could not read this page."
        )
        raise HTTPException(status_code=status, detail=message)

    return Response(
        content=upstream.content,
        media_type=upstream.headers.get("content-type", "audio/mpeg"),
        headers={"Cache-Control": "no-store", "Content-Disposition": 'inline; filename="cstar-narration.mp3"'},
    )
