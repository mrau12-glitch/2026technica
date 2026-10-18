"""Small FastAPI backend for reading page-specific text with ElevenLabs.

Run:
    pip install fastapi uvicorn elevenlabs
    export ELEVENLABS_API_KEY="..."
    export ELEVENLABS_VOICE_ID="..."  # voice to use for this site
    uvicorn tts_server:app --reload

The browser should POST the text visible to the current user to /api/speak,
then play the returned audio/mpeg response. Keep the ElevenLabs key on the server.
"""
import os
from typing import Annotated

from elevenlabs.client import ElevenLabs
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

app = FastAPI(title="2026technica Text-to-Speech API")

# Configure this to the deployed website origin, e.g. https://example.com.
# For local development, set CORS_ORIGINS=http://localhost:5173
allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


class SpeechRequest(BaseModel):
    # The browser sends the content for the current visitor, so each visitor can
    # hear the page state/content they are currently viewing.
    text: Annotated[str, Field(min_length=1, max_length=5000)]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/speak")
def speak(request: SpeechRequest) -> Response:
    api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = os.getenv("ELEVENLABS_VOICE_ID")
    if not api_key or not voice_id:
        raise HTTPException(
            status_code=503,
            detail="Server must configure ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID.",
        )

    try:
        client = ElevenLabs(api_key=api_key)
        audio_chunks = client.text_to_speech.convert(
            text=request.text,
            voice_id=voice_id,
            model_id=os.getenv("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2"),
            output_format="mp3_44100_128",
        )
        audio = b"".join(audio_chunks)
    except Exception as exc:
        # Do not return exception details, which could expose server configuration.
        raise HTTPException(status_code=502, detail="Speech generation failed.") from exc

    return Response(
        content=audio,
        media_type="audio/mpeg",
        headers={"Cache-Control": "no-store"},
    )
