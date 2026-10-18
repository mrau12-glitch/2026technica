const ELEVEN_MUSIC_URL = 'https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128'

type MusicRequest = {
  type?: unknown
  prompt?: unknown
  durationMs?: unknown
}

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'ElevenLabs is not configured.' }, { status: 503 })
  }

  let input: MusicRequest
  try {
    input = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (input.type !== 'drums' && input.type !== 'melody') {
    return Response.json({ error: 'Only drums and melodic instruments can be generated.' }, { status: 400 })
  }

  const rawPrompt = typeof input.prompt === 'string' ? input.prompt.trim() : ''
  if (rawPrompt.length > 2000) {
    return Response.json({ error: 'The description must be 2,000 characters or fewer.' }, { status: 400 })
  }

  const requestedDuration = typeof input.durationMs === 'number' ? input.durationMs : 30000
  const durationMs = Math.min(120000, Math.max(3000, Math.round(requestedDuration)))
  const prompt =
    input.type === 'drums'
      ? `Create an instrumental drum and percussion track only, with no vocals and no lead melody. ${rawPrompt || 'A clear, versatile mid-tempo groove with a natural performance.'}`
      : `Create an instrumental melodic track with no vocals. ${rawPrompt || 'A warm, expressive melody with a clear musical arc and gentle accompaniment.'}`

  const elevenResponse = await fetch(ELEVEN_MUSIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      prompt,
      music_length_ms: durationMs,
      force_instrumental: true,
    }),
    signal: AbortSignal.timeout(180000),
  })

  if (!elevenResponse.ok) {
    const details = await elevenResponse.text()
    console.error('Eleven Music request failed', elevenResponse.status, details.slice(0, 500))
    const message =
      elevenResponse.status === 401
        ? 'ElevenLabs rejected the API key.'
        : elevenResponse.status === 429
          ? 'ElevenLabs rate limit reached. Please try again shortly.'
          : 'Eleven Music could not generate this track.'
    return Response.json({ error: message }, { status: elevenResponse.status })
  }

  const audio = await elevenResponse.arrayBuffer()
  return new Response(audio, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Disposition': 'inline; filename="cstar-track.mp3"',
      'Content-Type': elevenResponse.headers.get('content-type') || 'audio/mpeg',
    },
  })
}
