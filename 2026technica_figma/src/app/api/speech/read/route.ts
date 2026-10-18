const ELEVEN_TTS_URL =
  'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM?output_format=mp3_44100_128'

type SpeechRequest = {
  text?: unknown
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

  const elevenResponse = await fetch(ELEVEN_TTS_URL, {
    method: 'POST',
    headers: {
      Accept: 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.42,
        similarity_boost: 0.82,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
    signal: AbortSignal.timeout(120000),
  })

  if (!elevenResponse.ok) {
    const details = await elevenResponse.text()
    console.error('ElevenLabs narration request failed', elevenResponse.status, details.slice(0, 500))
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
