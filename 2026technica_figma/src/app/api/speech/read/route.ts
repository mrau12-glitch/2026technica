const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'

type SpeechRequest = {
  text?: unknown
}

function setting(name: string, fallback: number) {
  const value = Number(process.env[name])
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback
}

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'ElevenLabs is not configured.' }, { status: 503 })
  }

  let input: SpeechRequest
  try {
    input = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const text = typeof input.text === 'string' ? input.text.replace(/\s+/g, ' ').trim() : ''
  if (!text || text.length > 5000) {
    return Response.json({ error: 'Narration text must contain between 1 and 5,000 characters.' }, { status: 400 })
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || DEFAULT_VOICE_ID
  const outputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT?.trim() || 'mp3_44100_128'
  const voiceUrl = new URL(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
  )
  voiceUrl.searchParams.set('output_format', outputFormat)

  let elevenResponse: Response
  try {
    elevenResponse = await fetch(voiceUrl, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_multilingual_v2',
        voice_settings: {
          stability: setting('ELEVENLABS_STABILITY', 0.42),
          similarity_boost: setting('ELEVENLABS_SIMILARITY_BOOST', 0.82),
          style: setting('ELEVENLABS_STYLE', 0.35),
          use_speaker_boost: process.env.ELEVENLABS_USE_SPEAKER_BOOST !== 'false',
        },
      }),
      signal: AbortSignal.timeout(120000),
    })
  } catch {
    return Response.json({ error: 'Could not connect to ElevenLabs. Please try again.' }, { status: 502 })
  }

  if (!elevenResponse.ok) {
    // Log status only; never log the visitor's page text or API response body.
    console.error('ElevenLabs narration request failed', elevenResponse.status)
    const message =
      elevenResponse.status === 401
        ? 'ElevenLabs rejected the API key.'
        : elevenResponse.status === 429
          ? 'ElevenLabs rate limit reached. Please try again shortly.'
          : 'ElevenLabs could not read this page.'
    return Response.json({ error: message }, { status: elevenResponse.status })
  }

  return new Response(await elevenResponse.arrayBuffer(), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Disposition': 'inline; filename="cstar-narration.mp3"',
      'Content-Type': elevenResponse.headers.get('content-type') || 'audio/mpeg',
    },
  })
}
