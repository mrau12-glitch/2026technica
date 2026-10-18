# Cstar ElevenLabs TTS proxy

This small FastAPI service keeps the ElevenLabs API key on the server and exposes
`POST /speech` for the Figma Make preview. `GET /health` is a health check.

## Deploy on Render

1. In Render, choose **New → Blueprint** and select this repository.
2. Render reads the root `render.yaml` and creates the free web service.
3. In the service environment settings, add `ELEVENLABS_API_KEY` as a secret.
   The default voice is the supplied voice ID; you can override it with
   `ELEVENLABS_VOICE_ID`.
4. Wait for the service to become live and open its `/health` URL. It should return
   `{"ok":true,"provider":"elevenlabs"}`.
5. Copy the base service URL (for example, `https://cstar-elevenlabs-tts.onrender.com`).
6. In the Figma Make app environment/settings, set
   `NEXT_PUBLIC_TTS_PROXY_URL` to that base URL, then rebuild/publish the preview.
   The frontend sends narration to `<base URL>/speech`. If the app has no environment
   variable UI, replace the empty fallback in `CstarApp.tsx` with the service URL,
   then copy the updated file into Figma Make.

The API key belongs only in Render's `ELEVENLABS_API_KEY` setting. Never put it in
Figma code or a `NEXT_PUBLIC_` variable.

The endpoint limits text to 5,000 characters and throttles each observed client IP
to 20 requests per minute. This is a basic safeguard, not user authentication or a
shared production rate limiter. Keep an eye on ElevenLabs usage during the demo.

Render's free web services can spin down after inactivity, which may make the first
request slow. Open `/health` shortly before a presentation; the frontend keeps the
device voice fallback if the hosted TTS request fails.
