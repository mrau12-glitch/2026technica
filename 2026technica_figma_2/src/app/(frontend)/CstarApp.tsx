'use client'

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type IconName =
  | 'accessibility'
  | 'chevron'
  | 'headphones'
  | 'mic'
  | 'pause'
  | 'play'
  | 'plus'
  | 'save'
  | 'settings'
  | 'skipBack'
  | 'skipForward'
  | 'sparkles'
  | 'volume'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    accessibility: <><circle cx="12" cy="4" r="1.5"/><path d="M5 8.5c4.7-1.7 9.3-1.7 14 0M12 8.5V21M8.5 21l3.5-6 3.5 6M7 12l5-3.5 5 3.5"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    headphones: <><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v6H5a1 1 0 0 1-1-1v-5ZM20 14h-3v6h2a1 1 0 0 0 1-1v-5Z"/></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></>,
    pause: <><path d="M9 6v12M15 6v12"/></>,
    play: <path d="m9 6 9 6-9 6V6Z"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    save: <><path d="M5 3h12l3 3v15H4V4a1 1 0 0 1 1-1Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    skipBack: <><path d="M6 5v14M18 6l-8 6 8 6V6Z"/></>,
    skipForward: <><path d="M18 5v14M6 6l8 6-8 6V6Z"/></>,
    sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3ZM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 13l.7 2.3 2.3.7-2.3.7L19 19l-.7-2.3L16 16l2.3-.7L19 13Z"/></>,
    volume: <><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a8 8 0 0 1 0 11"/></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}


type Track = {
  name: string
  desc: string
  color: string
  pattern: number[]
  audioUrl?: string
}

type DrumHit = {
  id: string
  name: string
  timeMs: number
}

type DrumLayer = {
  id: number
  name: string
  hits: DrumHit[]
}

const createInitialDrumLayers = (): DrumLayer[] => [{ id: 1, name: 'Layer 1', hits: [] }]

const DRUM_LOOP_DURATION_MS = 4000

const starterTracks: Track[] = [
  { name: 'Piano', desc: 'Lead melody · Warm and gentle', color: '#a8d5d1', pattern: [18, 34, 24, 46, 27, 39, 21, 42, 30, 18, 35, 25] },
  { name: 'Strings', desc: 'Harmony · Slow and spacious', color: '#c9bce7', pattern: [12, 20, 29, 24, 35, 42, 38, 27, 31, 40, 24, 18] },
  { name: 'Double Bass', desc: 'Bass · Soft rhythm', color: '#fb9b6d', pattern: [35, 16, 32, 14, 38, 18, 34, 14, 28, 17, 34, 13] },
]

const projects = [
  { title: 'Morning Light', mood: 'Warm, peaceful and unhurried', tracks: 3, duration: '2:46', color: '#dceff7', updated: 'Edited today' },
  { title: 'Rain on Glass', mood: 'Ambient textures and soft percussion', tracks: 5, duration: '4:12', color: '#dce5ef', updated: 'Edited yesterday' },
  { title: 'City at Dusk', mood: 'Gentle pulse with electric piano', tracks: 4, duration: '3:28', color: '#ffe5d8', updated: 'Edited 4 days ago' },
]

const drumPads = [
  { id: 'closed_hi_hat', name: 'Closed Hi-Hat', key: 'A', eventKey: 'a', color: '#a8d5d1' },
  { id: 'kick', name: 'Kick', key: 'S', eventKey: 's', color: '#fb9b6d' },
  { id: 'snare', name: 'Snare', key: 'D', eventKey: 'd', color: '#d4c1eb' },
  { id: 'low_tom', name: 'Low Tom', key: 'F', eventKey: 'f', color: '#b8cce7' },
  { id: 'open_hi_hat', name: 'Open Hi-Hat', key: 'J', eventKey: 'j', color: '#9ed9cf' },
  { id: 'high_tom', name: 'High Tom', key: 'K', eventKey: 'k', color: '#c9bce7' },
  { id: 'bass', name: 'Bass', key: 'L', eventKey: 'l', color: '#f3c89c' },
  { id: 'shaker', name: 'Shaker', key: ';', eventKey: ';', color: '#edc7c1' },
]

let drumAudioContext: AudioContext | null = null

function playDrumSound(id: string) {
  const AudioContextClass = window.AudioContext
  if (!drumAudioContext || drumAudioContext.state === 'closed') {
    drumAudioContext = new AudioContextClass()
  }
  const context = drumAudioContext
  if (context.state === 'suspended') void context.resume()
  const now = context.currentTime
  const gain = context.createGain()
  gain.connect(context.destination)

  if (id === 'kick' || id === 'bass' || id === 'low_tom' || id === 'high_tom') {
    const oscillator = context.createOscillator()
    const settings = {
      kick: { start: 150, end: 45, duration: 0.22, volume: 0.8, type: 'sine' as OscillatorType },
      bass: { start: 92, end: 52, duration: 0.48, volume: 0.58, type: 'sine' as OscillatorType },
      low_tom: { start: 155, end: 82, duration: 0.32, volume: 0.62, type: 'triangle' as OscillatorType },
      high_tom: { start: 260, end: 145, duration: 0.24, volume: 0.54, type: 'triangle' as OscillatorType },
    }[id]
    oscillator.type = settings.type
    oscillator.frequency.setValueAtTime(settings.start, now)
    oscillator.frequency.exponentialRampToValueAtTime(settings.end, now + settings.duration * 0.72)
    gain.gain.setValueAtTime(settings.volume, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + settings.duration)
    oscillator.connect(gain)
    oscillator.start(now)
    oscillator.stop(now + settings.duration + 0.01)
    return
  }

  const duration = id === 'open_hi_hat' ? 0.42 : id === 'shaker' ? 0.22 : id === 'snare' ? 0.18 : 0.08
  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const noise = Math.random() * 2 - 1
    data[i] = id === 'shaker' ? noise * (i % 13 < 4 ? 1 : 0.18) : noise
  }
  const source = context.createBufferSource()
  const filter = context.createBiquadFilter()
  filter.type = id.includes('hi_hat') || id === 'shaker' ? 'highpass' : 'bandpass'
  filter.frequency.value = id.includes('hi_hat') ? 6500 : id === 'shaker' ? 4200 : 1500
  gain.gain.setValueAtTime(id === 'snare' ? 0.58 : id === 'shaker' ? 0.28 : 0.34, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
  source.buffer = buffer
  source.connect(filter)
  filter.connect(gain)
  source.start(now)
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [page, setPage] = useState<'home' | 'project'>('home')
  const [projectTitle, setProjectTitle] = useState('Morning Light')
  const [projectTracks, setProjectTracks] = useState<Track[]>(starterTracks)
  const [activeTrack, setActiveTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showDescribe, setShowDescribe] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [description, setDescription] = useState('')
  const [trackType, setTrackType] = useState<'drums' | 'melody' | 'vocals' | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')
  const [drumSequence, setDrumSequence] = useState<string[]>([])
  const [drumLayers, setDrumLayers] = useState<DrumLayer[]>(createInitialDrumLayers)
  const [activeDrumLayerId, setActiveDrumLayerId] = useState(1)
  const [isDrumLoopPlaying, setIsDrumLoopPlaying] = useState(false)
  const [isDrumRecording, setIsDrumRecording] = useState(false)
  const [drumStatus, setDrumStatus] = useState('Ready to record Layer 1.')
  const [activeDrum, setActiveDrum] = useState<string | null>(null)
  const [readStatus, setReadStatus] = useState<'idle' | 'loading' | 'reading'>('idle')
  const [narrationSource, setNarrationSource] = useState<'elevenlabs' | 'device' | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const narrationRef = useRef<SpeechSynthesisUtterance | null>(null)
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null)
  const narrationRequestRef = useRef<AbortController | null>(null)
  const narrationUrlRef = useRef<string | null>(null)
  const narrationPauseRef = useRef<number | null>(null)
  const drumLayersRef = useRef(drumLayers)
  const drumLoopCycleTimerRef = useRef<number | null>(null)
  const drumLoopHitTimersRef = useRef<number[]>([])
  const drumFlashTimerRef = useRef<number | null>(null)
  const isDrumRecordingRef = useRef(false)
  const drumRecordingOriginRef = useRef<number | null>(null)
  const drumPlaybackOriginRef = useRef<number | null>(null)
  const committedDrumLayerIdsRef = useRef<Set<number>>(new Set())
  const activeDrumLayerIdRef = useRef(1)
  const nextDrumLayerIdRef = useRef(2)

  const stopNarration = useCallback(() => {
    narrationRequestRef.current?.abort()
    narrationRequestRef.current = null
    narrationAudioRef.current?.pause()
    narrationAudioRef.current = null
    window.speechSynthesis?.cancel()
    if (narrationPauseRef.current !== null) window.clearTimeout(narrationPauseRef.current)
    narrationPauseRef.current = null
    narrationRef.current = null
    if (narrationUrlRef.current) URL.revokeObjectURL(narrationUrlRef.current)
    narrationUrlRef.current = null
    setNarrationSource(null)
    setReadStatus('idle')
  }, [])

  const readCurrentPage = useCallback(async () => {
    if (readStatus === 'loading' || readStatus === 'reading') {
      stopNarration()
      return
    }

    let narration: string[]
    if (!currentUser) {
      narration =
        authMode === 'login'
          ? ['Sign in to create.', 'Press the Sign in button to continue.', 'You can also continue with Google.', 'Email and password are optional in this demo.']
          : ['Create your account.', 'Enter your name, email address, and a password with at least six characters.', 'Then press Create account.']
    } else if (showDescribe) {
      if (!trackType) {
        narration = [
          'Add a track.',
          'Choose a track type.',
          'Drums for beats, percussion, and rhythm.',
          'Melodic Instrument for piano, strings, guitar, and more.',
          'Or Vocals for singing, humming, and spoken voice.',
        ]
      } else if (trackType === 'drums') {
        narration = [
          'Create Drums.',
          'Build a four-second loop with eight drum pads.',
          'Press A for Closed Hi-Hat.',
          'S for Kick.',
          'D for Snare.',
          'F for Low Tom.',
          'J for Open Hi-Hat.',
          'K for High Tom.',
          'L for Bass.',
          'Semicolon for Shaker.',
          'G plays or pauses all layers. H adds a layer. R starts or stops recording.',
          drumSequence.length ? `Your current pattern has ${drumSequence.length} hits across ${drumLayers.length} layers.` : 'Press R once to start Layer 1. Press R again to stop and commit it.',
        ]
      } else {
        narration = [
          `Create ${trackType === 'melody' ? 'a Melodic Instrument' : 'Vocals'}.`,
          'Describe the track in words or record a musical reference.',
          generationError || (trackType === 'melody' ? 'Then generate it with Eleven Music.' : 'Then add the vocal track.'),
        ]
      }
    } else if (page === 'home') {
      narration = [
        'Music Projects.',
        'Three project cards are arranged across the page.',
        'From left to right.',
        ...projects.map(project => project.title),
      ]
    } else {
      const trackSummary = projectTracks.length
        ? projectTracks.map((track, index) => `${index === activeTrack ? 'Selected track' : 'Track'} ${index + 1}, ${track.name}, ${track.desc}.`)
        : ['This project has no tracks yet.']
      narration = [`Project ${projectTitle}.`, `${projectTracks.length} tracks.`, ...trackSummary, 'Choose Add Track to create another musical part.']
    }

    const speakWithDeviceVoice = () => {
      if (!('speechSynthesis' in window)) {
        setNarrationSource(null)
        setReadStatus('idle')
        return
      }
      setNarrationSource('device')
      setReadStatus('reading')
      const speakPart = (index: number) => {
        const utterance = new SpeechSynthesisUtterance(narration[index])
        narrationRef.current = utterance
        utterance.lang = 'en-US'
        utterance.rate = 0.78
        utterance.onend = () => {
          if (narrationRef.current !== utterance) return
          if (index === narration.length - 1) {
            narrationRef.current = null
            setNarrationSource(null)
            setReadStatus('idle')
            return
          }
          narrationPauseRef.current = window.setTimeout(() => speakPart(index + 1), 650)
        }
        utterance.onerror = () => {
          if (narrationRef.current === utterance) {
            narrationRef.current = null
            setNarrationSource(null)
            setReadStatus('idle')
          }
        }
        window.speechSynthesis.speak(utterance)
      }
      window.speechSynthesis.cancel()
      speakPart(0)
    }

    const controller = new AbortController()
    narrationRequestRef.current = controller
    setReadStatus('loading')

    try {
      const response = await fetch('/api/speech/read', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: narration.join(' ... ') }),
        signal: controller.signal,
      })
      if (!response.ok) throw new Error('ElevenLabs narration is unavailable.')
      if (!response.headers.get('content-type')?.startsWith('audio/')) {
        speakWithDeviceVoice()
        return
      }

      const audioUrl = URL.createObjectURL(await response.blob())
      narrationUrlRef.current = audioUrl
      const narrationAudio = new Audio(audioUrl)
      narrationAudioRef.current = narrationAudio
      narrationAudio.onended = stopNarration
      narrationAudio.onerror = () => {
        stopNarration()
        speakWithDeviceVoice()
      }
      setNarrationSource('elevenlabs')
      await narrationAudio.play()
      setReadStatus('reading')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      stopNarration()
      speakWithDeviceVoice()
    } finally {
      narrationRequestRef.current = null
    }
  }, [
    activeTrack,
    authMode,
    currentUser,
    drumSequence.length,
    drumLayers.length,
    generationError,
    page,
    projectTitle,
    projectTracks,
    readStatus,
    showDescribe,
    stopNarration,
    trackType,
  ])

  useEffect(() => {
    const handleReadShortcut = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      event.preventDefault()
      void readCurrentPage()
    }
    window.addEventListener('keydown', handleReadShortcut)
    return () => window.removeEventListener('keydown', handleReadShortcut)
  }, [readCurrentPage])

  useEffect(() => () => stopNarration(), [stopNarration])

  const completeMockLogin = (name: string) => {
    setCurrentUser(name.trim() || 'Musician')
    setAuthError('')
    setAuthPassword('')
  }

  const submitAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (authMode === 'login') {
      completeMockLogin(authEmail.split('@')[0] || 'Musician')
      return
    }
    if (!authEmail.includes('@') || authPassword.length < 6) {
      setAuthError('Enter a valid email and a password with at least 6 characters.')
      return
    }
    completeMockLogin(authMode === 'signup' ? authName : authEmail.split('@')[0])
  }

  const logOut = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
    setPage('home')
    setCurrentUser(null)
  }

  useEffect(() => {
    drumLayersRef.current = drumLayers
  }, [drumLayers])

  const clearDrumLoopTimers = useCallback(() => {
    if (drumLoopCycleTimerRef.current !== null) {
      window.clearTimeout(drumLoopCycleTimerRef.current)
      drumLoopCycleTimerRef.current = null
    }
    drumLoopHitTimersRef.current.forEach(timer => window.clearTimeout(timer))
    drumLoopHitTimersRef.current = []
  }, [])

  const stopDrumLoop = useCallback(() => {
    clearDrumLoopTimers()
    if (drumAudioContext?.state === 'running') void drumAudioContext.suspend()
    drumPlaybackOriginRef.current = null
    setIsDrumLoopPlaying(false)
    setDrumStatus(isDrumRecordingRef.current ? 'Playback paused. Recording continues.' : 'Playback paused.')
  }, [clearDrumLoopTimers])

  const startDrumLoop = useCallback(() => {
    if (drumLoopCycleTimerRef.current !== null) return
    clearDrumLoopTimers()
    drumPlaybackOriginRef.current = window.performance.now()
    const scheduleCycle = () => {
      const layers = drumLayersRef.current
      const hits = layers.flatMap(layer => layer.hits)
      const now = window.performance.now()
      const origin = drumPlaybackOriginRef.current ?? now
      const elapsed = Math.max(0, now - origin)
      const cycleStart = origin + Math.floor(elapsed / DRUM_LOOP_DURATION_MS) * DRUM_LOOP_DURATION_MS
      const elapsedInCycle = now - cycleStart
      drumLoopHitTimersRef.current = hits.map(hit =>
        window.setTimeout(
          () => playDrumSound(hit.id),
          Math.max(0, hit.timeMs - elapsedInCycle),
        ),
      )
      drumLoopCycleTimerRef.current = window.setTimeout(
        scheduleCycle,
        Math.max(0, cycleStart + DRUM_LOOP_DURATION_MS - window.performance.now()),
      )
    }

    setIsDrumLoopPlaying(true)
    scheduleCycle()
    setDrumStatus('Playback started. Completed layers are looping.')
  }, [clearDrumLoopTimers])

  const toggleDrumLoop = useCallback(() => {
    if (isDrumLoopPlaying) stopDrumLoop()
    else startDrumLoop()
  }, [isDrumLoopPlaying, startDrumLoop, stopDrumLoop])

  const resetDrumSequencer = useCallback(() => {
    stopDrumLoop()
    const initialLayers = createInitialDrumLayers()
    drumLayersRef.current = initialLayers
    activeDrumLayerIdRef.current = 1
    drumRecordingOriginRef.current = null
    isDrumRecordingRef.current = false
    committedDrumLayerIdsRef.current.clear()
    nextDrumLayerIdRef.current = 2
    setDrumLayers(initialLayers)
    setActiveDrumLayerId(1)
    setIsDrumRecording(false)
    setDrumStatus('Ready to record Layer 1.')
    setDrumSequence([])
    setActiveDrum(null)
  }, [stopDrumLoop])

  const openDescribe = () => {
    setTrackType(null)
    setDescription('')
    setIsListening(false)
    setIsRecording(false)
    setGenerationError('')
    resetDrumSequencer()
    setShowDescribe(true)
  }

  const closeDescribe = () => {
    stopDrumLoop()
    isDrumRecordingRef.current = false
    drumRecordingOriginRef.current = null
    setIsDrumRecording(false)
    setShowDescribe(false)
    setIsListening(false)
    setIsRecording(false)
  }

  const addDrumLayer = useCallback(() => {
    if (isDrumRecordingRef.current) {
      setDrumStatus('Stop recording before adding a manual layer.')
      return
    }
    if (drumLayersRef.current.length >= 8) return
    const id = nextDrumLayerIdRef.current++
    const nextLayer = { id, name: `Layer ${id}`, hits: [] }
    const updatedLayers = [...drumLayersRef.current, nextLayer]
    drumLayersRef.current = updatedLayers
    setDrumLayers(updatedLayers)
    activeDrumLayerIdRef.current = id
    setActiveDrumLayerId(id)
    setDrumStatus(`${nextLayer.name} added and selected.`)
  }, [])

  const selectDrumLayer = useCallback((id: number) => {
    if (isDrumRecordingRef.current) {
      setDrumStatus('Stop recording before selecting another layer.')
      return
    }
    activeDrumLayerIdRef.current = id
    setActiveDrumLayerId(id)
    setDrumStatus(`Layer ${id} selected.`)
  }, [])

  const clearActiveDrumLayer = useCallback(() => {
    const updatedLayers = drumLayersRef.current.map(layer =>
      layer.id === activeDrumLayerId ? { ...layer, hits: [] } : layer,
    )
    drumLayersRef.current = updatedLayers
    setDrumLayers(updatedLayers)
    setDrumSequence(updatedLayers.flatMap(layer => layer.hits.map(hit => hit.name)))
    setDrumStatus(`Layer ${activeDrumLayerId} cleared.`)
    if (isDrumLoopPlaying && !updatedLayers.some(layer => layer.hits.length)) stopDrumLoop()
  }, [activeDrumLayerId, isDrumLoopPlaying, stopDrumLoop])

  const triggerDrum = useCallback((id: string) => {
    const pad = drumPads.find(item => item.id === id)
    if (!pad) return
    playDrumSound(id)
    setActiveDrum(id)
    if (drumFlashTimerRef.current !== null) window.clearTimeout(drumFlashTimerRef.current)
    drumFlashTimerRef.current = window.setTimeout(() => {
      setActiveDrum(current => current === id ? null : current)
      drumFlashTimerRef.current = null
    }, 130)

    if (!isDrumRecordingRef.current || drumRecordingOriginRef.current === null) return

    setDrumSequence(sequence => [...sequence, pad.name])
    const now = window.performance.now()
    const recordingLayerId = activeDrumLayerIdRef.current
    const timeMs = Math.round((now - drumRecordingOriginRef.current) % DRUM_LOOP_DURATION_MS)
    const hit = { id: pad.id, name: pad.name, timeMs: Math.max(0, timeMs) }
    setDrumLayers(layers => {
      const updatedLayers = layers.map(layer =>
        layer.id === recordingLayerId ? { ...layer, hits: [...layer.hits, hit] } : layer,
      )
      drumLayersRef.current = updatedLayers
      return updatedLayers
    })
  }, [])

  const toggleDrumRecording = useCallback(() => {
    const playbackIsRunning = drumLoopCycleTimerRef.current !== null
    if (isDrumRecordingRef.current) {
      isDrumRecordingRef.current = false
      drumRecordingOriginRef.current = null
      setIsDrumRecording(false)

      const committedLayer = drumLayersRef.current.find(
        layer => layer.id === activeDrumLayerIdRef.current,
      )
      const layerName = committedLayer?.name || 'Active layer'
      const hitCount = committedLayer?.hits.length || 0
      if (committedLayer) committedDrumLayerIdsRef.current.add(committedLayer.id)
      if (committedLayer?.id === 1 && hitCount > 0 && !playbackIsRunning) {
        startDrumLoop()
        setDrumStatus(`${layerName} stopped and committed with ${hitCount} hits. Layer 1 playback started and is looping.`)
      } else {
        setDrumStatus(`${layerName} stopped and committed with ${hitCount} hits.${playbackIsRunning ? ' Existing playback continues.' : ''}`)
      }
      return
    }

    const hasCommittedLayer = committedDrumLayerIdsRef.current.size > 0
    let recordingLayer = drumLayersRef.current.find(
      layer =>
        layer.id === activeDrumLayerIdRef.current &&
        layer.hits.length === 0 &&
        !committedDrumLayerIdsRef.current.has(layer.id),
    )

    if (!hasCommittedLayer) {
      recordingLayer = drumLayersRef.current.find(layer => layer.id === 1)
    } else if (!recordingLayer) {
      if (drumLayersRef.current.length >= 8) {
        setDrumStatus('All eight layers are in use. Clear a layer before recording another take.')
        return
      }
      const id = nextDrumLayerIdRef.current++
      recordingLayer = { id, name: `Layer ${id}`, hits: [] }
      const updatedLayers = [...drumLayersRef.current, recordingLayer]
      drumLayersRef.current = updatedLayers
      setDrumLayers(updatedLayers)
    }

    if (!recordingLayer) return
    activeDrumLayerIdRef.current = recordingLayer.id
    setActiveDrumLayerId(recordingLayer.id)
    drumRecordingOriginRef.current =
      playbackIsRunning && drumPlaybackOriginRef.current !== null
        ? drumPlaybackOriginRef.current
        : window.performance.now()
    isDrumRecordingRef.current = true
    setIsDrumRecording(true)
    setDrumStatus(`Recording ${recordingLayer.name}. Press R again to stop and commit this layer.`)
  }, [startDrumLoop])

  useEffect(() => {
    if (!showDescribe || trackType !== 'drums') return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key.toLowerCase() === 'g') {
        event.preventDefault()
        toggleDrumLoop()
        return
      }
      if (event.key.toLowerCase() === 'h') {
        event.preventDefault()
        addDrumLayer()
        return
      }
      if (event.key.toLowerCase() === 'r') {
        event.preventDefault()
        toggleDrumRecording()
        return
      }
      const pad = drumPads.find(item =>
        item.eventKey === event.key.toLowerCase() ||
        (item.id === 'shaker' && event.code === 'Semicolon'),
      )
      if (!pad) return
      event.preventDefault()
      triggerDrum(pad.id)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [addDrumLayer, showDescribe, toggleDrumLoop, toggleDrumRecording, trackType, triggerDrum])

  useEffect(() => {
    if (!showDescribe || trackType !== 'drums') {
      stopDrumLoop()
      isDrumRecordingRef.current = false
      drumRecordingOriginRef.current = null
      setIsDrumRecording(false)
    }
  }, [showDescribe, stopDrumLoop, trackType])

  useEffect(() => () => {
    clearDrumLoopTimers()
    isDrumRecordingRef.current = false
    drumRecordingOriginRef.current = null
    if (drumFlashTimerRef.current !== null) window.clearTimeout(drumFlashTimerRef.current)
    if (drumAudioContext && drumAudioContext.state !== 'closed') {
      void drumAudioContext.close()
      drumAudioContext = null
    }
  }, [clearDrumLoopTimers])

  const openProject = (title: string) => {
    setProjectTitle(title)
    setProjectTracks(starterTracks)
    setActiveTrack(0)
    setPage('project')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const createProject = () => {
    setProjectTitle('Untitled Project')
    setProjectTracks([])
    setPage('project')
  }

  const addTrack = async () => {
    if (!trackType) return

    const typeNames = { drums: 'Drums', melody: 'Melodic Instrument', vocals: 'Vocals' }
    let audioUrl: string | undefined

    const layeredDrumDescription = drumLayers
      .filter(layer => layer.hits.length)
      .map(layer => `${layer.name}: ${layer.hits.map(hit => `${hit.id} (${hit.name}) at ${hit.timeMs} milliseconds`).join(', ')}`)
      .join('. ')
    const effectiveDescription = trackType === 'drums' && layeredDrumDescription
      ? `Build the groove around these recorded drum layers. ${layeredDrumDescription}.`
      : description.trim()

    if (trackType === 'drums' || trackType === 'melody') {
      setIsGenerating(true)
      setGenerationError('')

      try {
        const response = await fetch('/api/music/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: trackType,
            prompt: effectiveDescription,
            durationMs: 30000,
          }),
        })

        if (!response.ok) {
          const result = await response.json().catch(() => null)
          throw new Error(result?.error || 'Music generation failed. Please try again.')
        }

        audioUrl = URL.createObjectURL(await response.blob())
      } catch (error) {
        setGenerationError(error instanceof Error ? error.message : 'Music generation failed.')
        setIsGenerating(false)
        return
      }
    }

    const newTrack: Track = {
      name: trackType ? typeNames[trackType] : `New Track ${projectTracks.length + 1}`,
      desc: effectiveDescription || 'AI-generated musical idea',
      color: ['#8fcde8', '#b9d9e8', '#fb9b6d', '#c9e4f0'][projectTracks.length % 4],
      pattern: [22, 38, 18, 44, 30, 25, 42, 19, 35, 28, 40, 20],
      audioUrl,
    }
    setProjectTracks([...projectTracks, newTrack])
    setActiveTrack(projectTracks.length)
    setDescription('')
    setIsListening(false)
    setIsGenerating(false)
    closeDescribe()
  }

  const togglePlayback = async () => {
    const activeAudio = projectTracks[activeTrack]?.audioUrl
    if (!activeAudio || !audioRef.current) {
      setIsPlaying(!isPlaying)
      return
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      await audioRef.current.play()
      setIsPlaying(true)
    }
  }

  if (!currentUser) {
    return (
      <main className="high-contrast min-h-screen bg-[#eaf5f9] text-[#071c2b]">
        <a href="#auth-form" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3">Skip to sign in</a>
        <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
          <section className="relative hidden overflow-hidden bg-[#046492] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div aria-hidden="true" className="absolute -left-24 -top-24 h-72 w-72 rounded-full border-[48px] border-white/10"/>
            <div aria-hidden="true" className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#fb9b6d] opacity-90"/>
            <div className="relative flex items-center gap-4 text-left">
              <span className="grid h-36 w-36 place-items-center rounded-full bg-white"><Image src="/cstar-logo.png" alt="" width={108} height={112} className="h-28 w-auto object-contain" loading="eager" unoptimized/></span>
              <strong className="font-serif block text-3xl">Cstar</strong>
            </div>
            <div className="relative max-w-xl pb-16">
              <span className="mb-7 grid h-16 w-16 place-items-center rounded-2xl bg-white/15"><Icon name="accessibility" size={31}/></span>
              <h1 className="font-serif text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">Compose without barriers.</h1>
              <div className="mt-10 flex items-center gap-3 text-sm font-bold"><span className="h-1.5 w-12 rounded-full bg-[#fb9b6d]"/><span>Hands as eyes, sounds as light</span></div>
            </div>
          </section>

          <section className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-10">
            <div className="w-full max-w-md">
              <div className="mb-10 flex items-center gap-4 text-left lg:hidden">
                <span className="grid h-24 w-24 place-items-center"><Image src="/cstar-logo.png" alt="" width={92} height={96} className="h-24 w-auto object-contain" loading="eager" unoptimized/></span>
                <strong className="font-serif block text-2xl">Cstar</strong>
              </div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#046492]">{authMode === 'login' ? 'Welcome back' : 'Join Cstar'}</p>
              <h2 className="font-serif mt-3 text-4xl font-bold tracking-tight">{authMode === 'login' ? 'Sign in to create' : 'Create your account'}</h2>

              <button type="button" onClick={() => completeMockLogin('Google Musician')} className="focus-ring mt-8 flex h-13 w-full items-center justify-center gap-3 rounded-xl border-2 border-[#6f8d9c] bg-white px-5 font-bold text-[#071c2b] transition hover:bg-[#eef7fb]">
                <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-[conic-gradient(from_-45deg,#4285f4_0_25%,#34a853_0_50%,#fbbc05_0_75%,#ea4335_0)] text-xs font-black text-white">G</span>
                Continue with Google
              </button>

              <div className="my-7 flex items-center gap-4" aria-hidden="true"><span className="h-px flex-1 bg-[#9bb1bb]"/><span className="text-xs font-bold uppercase tracking-widest text-[#526f7d]">or</span><span className="h-px flex-1 bg-[#9bb1bb]"/></div>

              <form id="auth-form" onSubmit={submitAuth} noValidate>
                {authMode === 'signup' && (
                  <label className="mb-5 block font-bold" htmlFor="auth-name">
                    Name
                    <input id="auth-name" name="name" autoComplete="name" value={authName} onChange={(event) => setAuthName(event.target.value)} className="focus-ring mt-2 h-13 w-full rounded-xl border-2 border-[#6f8d9c] bg-white px-4 font-normal outline-none" placeholder="How should we address you?" required/>
                  </label>
                )}
                <label className="mb-5 block font-bold" htmlFor="auth-email">
                  Email address
                  <input id="auth-email" name="email" type="email" autoComplete="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} className="focus-ring mt-2 h-13 w-full rounded-xl border-2 border-[#6f8d9c] bg-white px-4 font-normal outline-none" placeholder="you@example.com" required={authMode === 'signup'}/>
                </label>
                <label className="block font-bold" htmlFor="auth-password">
                  Password
                  <input id="auth-password" name="password" type="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} className="focus-ring mt-2 h-13 w-full rounded-xl border-2 border-[#6f8d9c] bg-white px-4 font-normal outline-none" placeholder="At least 6 characters" minLength={authMode === 'signup' ? 6 : undefined} required={authMode === 'signup'}/>
                </label>
                {authError && <p role="alert" className="mt-4 rounded-xl border border-[#a43f36] bg-[#fff0ed] px-4 py-3 text-sm font-bold text-[#7d2c25]">{authError}</p>}
                <button type="submit" className="focus-ring mt-6 flex h-13 w-full items-center justify-center rounded-xl bg-[#046492] px-5 font-bold text-white shadow-md transition hover:bg-[#03577f]">
                  {authMode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-[#294b5f]">
                {authMode === 'login' ? 'New to Cstar?' : 'Already have an account?'}
                <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError('') }} className="focus-ring ml-2 rounded-md font-bold text-[#046492] underline decoration-2 underline-offset-4">
                  {authMode === 'login' ? 'Create an account' : 'Sign in'}
                </button>
              </p>
              <p className="mt-8 rounded-xl bg-[#eaf5f9] px-4 py-3 text-center text-xs font-medium text-[#294b5f]">Demo mode — no account details are saved.</p>
            </div>
          </section>
        </div>
        <button data-reader-ignore type="button" onClick={readCurrentPage} className="focus-ring fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-2xl border-2 border-[#046492] bg-white px-4 py-3 text-sm font-bold text-[#071c2b] shadow-xl hover:bg-[#eef7fb]" aria-label={readStatus === 'reading' ? 'Stop reading this page' : 'Read this page aloud'}>
          <span className={`grid h-9 w-9 place-items-center rounded-xl ${readStatus === 'reading' ? 'bg-[#fb9b6d] text-[#071c2b]' : 'bg-[#046492] text-white'}`}><Icon name={readStatus === 'reading' ? 'volume' : 'accessibility'} size={19}/></span>
          <span>{readStatus === 'loading' ? 'Preparing natural voice…' : readStatus === 'reading' ? `Reading with ${narrationSource === 'elevenlabs' ? 'ElevenLabs' : 'device voice'} — Space to stop` : 'Press Space to read this page'}</span>
        </button>
      </main>
    )
  }

  return (
    <main className="high-contrast min-h-screen bg-white text-[#102a3a]">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3">Skip to content</a>
      <header className="flex h-[72px] items-center justify-between border-b border-[#d9dfdc] bg-white px-5 md:px-9">
        <button onClick={() => setPage('home')} className="focus-ring flex items-center gap-3 rounded-xl text-left" aria-label="Go to projects home">
          <span className="grid h-14 w-14 place-items-center"><Image src="/cstar-logo.png" alt="" width={54} height={56} className="h-14 w-auto object-contain" unoptimized/></span>
          <strong className="font-serif block text-xl tracking-tight">Cstar</strong>
        </button>
        <div className="flex items-center gap-2">
          <button aria-label="Settings" className="focus-ring grid h-10 w-10 place-items-center rounded-xl hover:bg-[#eef7fb]"><Icon name="settings"/></button>
          <div className="ml-1 hidden text-right sm:block"><strong className="block max-w-32 truncate text-sm">{currentUser}</strong><span className="block text-[11px] text-[#294b5f]">Signed in</span></div>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#dff1f8] font-bold text-[#046492]" aria-label={`User: ${currentUser}`}>{currentUser.charAt(0).toUpperCase()}</div>
          <button type="button" onClick={logOut} className="focus-ring ml-1 rounded-lg border border-[#6f8d9c] px-3 py-2 text-sm font-bold text-[#046492] hover:bg-[#eef7fb]">Sign out</button>
        </div>
      </header>

      {page === 'home' ? (
        <section id="content" className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#046492]">Your workspace</p><h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">Music Projects</h1></div>
            <button onClick={createProject} className="focus-ring flex h-12 items-center justify-center gap-2 rounded-xl bg-[#046492] px-5 font-bold text-white shadow-sm hover:bg-[#03577f]"><Icon name="plus" size={18}/> New music project</button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <button key={project.title} onClick={() => openProject(project.title)} className="focus-ring group overflow-hidden rounded-[22px] border border-[#d9dfdc] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <span className="wave-grid flex h-36 items-center justify-center gap-2 border-b border-[#d9dfdc] px-8" style={{ backgroundColor: project.color }}>
                  {[24, 46, 31, 62, 40, 72, 48, 57, 34, 64, 42, 28].map((height, i) => <i key={i} className="w-1.5 rounded-full bg-[#075b83]/70" style={{ height: height - index * 4 }}/>) }
                </span>
                <span className="block p-5"><span className="flex items-start justify-between gap-3"><strong className="font-serif text-xl">{project.title}</strong><span className="rounded-full bg-[#e9f5fa] px-2.5 py-1 text-xs font-bold text-[#046492]">{project.tracks} tracks</span></span><span className="mt-2 block text-sm text-[#65726c]">{project.mood}</span><span className="mt-5 flex justify-between text-xs font-medium text-[#87918d]"><span>{project.updated}</span><span>{project.duration}</span></span></span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section id="content" className="min-h-[calc(100vh-72px)] bg-[#17272f] p-3 text-[#f4f9fc] md:p-5">
          <div className="mx-auto max-w-[1500px] overflow-hidden rounded-xl border border-[#0d0f0e] bg-[#22333b] shadow-2xl">
            <div className="flex min-h-14 items-center gap-3 border-b border-black/60 bg-[#263943] px-3 py-2 shadow-md md:px-4">
              <button onClick={() => { setPage('home'); setIsPlaying(false) }} className="focus-ring flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-bold text-[#d8dfdb] hover:bg-white/10"><span className="rotate-180"><Icon name="chevron" size={17}/></span><span className="hidden sm:inline">Projects</span></button>
              <div className="h-6 w-px bg-white/10"/>
              <button onClick={openDescribe} className="focus-ring flex h-9 items-center gap-2 rounded-lg bg-[#e5f2f8] px-3 text-sm font-bold text-[#17272f] hover:bg-white"><Icon name="plus" size={16}/> Add Track</button>
              <div className="hidden min-w-0 flex-1 text-center md:block"><h1 className="truncate text-sm font-bold">{projectTitle}</h1><p className="text-[10px] text-[#a6bdc7]">{projectTracks.length} tracks · Autosaved</p></div>
              <div className="ml-auto flex items-center gap-1">
                <button className="focus-ring hidden h-9 rounded-lg px-3 text-xs font-bold text-[#c3d8e1] hover:bg-white/10 sm:block">Mixer</button>
                <button aria-label="Project settings" className="focus-ring grid h-9 w-9 place-items-center rounded-lg text-[#c3d8e1] hover:bg-white/10"><Icon name="settings" size={18}/></button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 border-b border-black/60 bg-[#203039] px-3 py-3 md:gap-5">
              <button aria-label="Go to beginning" className="focus-ring grid h-9 w-9 place-items-center rounded-lg text-[#e5f2f8] hover:bg-white/10"><Icon name="skipBack" size={18}/></button>
              <button onClick={togglePlayback} aria-label={isPlaying ? 'Pause' : 'Play'} className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-[#f1f4f2] text-[#123142] shadow-lg transition hover:scale-105"><Icon name={isPlaying ? 'pause' : 'play'} size={20}/></button>
              <button aria-label="Next section" className="focus-ring grid h-9 w-9 place-items-center rounded-lg text-[#e5f2f8] hover:bg-white/10"><Icon name="skipForward" size={18}/></button>
              <div className="ml-2 grid grid-cols-3 divide-x divide-[#102630] overflow-hidden rounded-md border border-[#111512] bg-[#102630] font-mono shadow-inner">
                <div className="px-3 py-1.5 text-center"><strong className="block text-sm font-medium text-[#8fd9fb]">5.1</strong><small className="block text-[9px] uppercase text-[#7995a2]">Position</small></div>
                <div className="hidden px-3 py-1.5 text-center sm:block"><strong className="block text-sm font-medium text-[#8fd9fb]">92</strong><small className="block text-[9px] uppercase text-[#7995a2]">Tempo</small></div>
                <div className="hidden px-3 py-1.5 text-center sm:block"><strong className="block text-sm font-medium text-[#8fd9fb]">4/4</strong><small className="block text-[9px] uppercase text-[#7995a2]">Time</small></div>
              </div>
              <div className="ml-auto hidden items-center gap-2 text-[#a6bdc7] lg:flex"><Icon name="volume" size={17}/><div className="h-1.5 w-20 rounded-full bg-[#10242d]"><div className="h-full w-2/3 rounded-full bg-[#8f9c96]"/></div></div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[780px]">
                <div className="grid grid-cols-[230px_1fr] border-b border-black/60 bg-[#1d2d35]">
                  <div className="flex items-center justify-between border-r border-black/60 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#9da8a3]"><span>Track controls</span><span>{projectTracks.length}</span></div>
                  <div className="daw-grid relative flex h-9 items-end justify-between px-4 pb-1.5 font-mono text-[10px] text-[#8d9993]">{[1,2,3,4,5,6,7,8,9].map(n => <span key={n}>{n}</span>)}<span className="absolute inset-y-0 left-[18%] z-20 w-px bg-[#fb9b6d]"><i className="absolute -left-1 top-0 h-2 w-2 rotate-45 bg-[#fb9b6d]"/></span></div>
                </div>

                {projectTracks.length ? <div className="relative">
                  {projectTracks.map((track, index) => (
                    <div key={`${track.name}-${index}`} onClick={() => { audioRef.current?.pause(); setIsPlaying(false); setActiveTrack(index) }} className={`grid grid-cols-[230px_1fr] border-b border-black/50 transition ${activeTrack === index ? 'bg-[#293f49]' : 'bg-[#263840] hover:bg-[#353a37]'}`}>
                      <div className="flex h-[92px] items-center gap-3 border-r border-black/60 px-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-[#123f54] shadow-inner" style={{ background: track.color }}><Icon name={index === 0 ? 'play' : 'volume'} size={19}/></div>
                        <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><strong className="truncate text-sm text-white">{track.name}</strong><span className="text-[10px] text-[#89a8b5]">{index + 1}</span></div><p className="mt-1 truncate text-[11px] text-[#9db2bc]">{track.desc}</p><div className="mt-2 flex items-center gap-1.5"><span className="grid h-5 w-5 place-items-center rounded bg-[#17272f] text-[9px] font-bold text-[#b9d0da]">M</span><span className="grid h-5 w-5 place-items-center rounded bg-[#17272f] text-[9px] font-bold text-[#b9d0da]">S</span><span className="ml-1 h-1 flex-1 rounded-full bg-[#102630]"><i className="block h-full w-3/5 rounded-full bg-[#79aabd]"/></span></div></div>
                      </div>
                      <div className="daw-grid relative h-[92px] overflow-hidden p-2.5">
                        <div className="absolute inset-y-0 left-[18%] z-20 w-px bg-[#fb9b6d]"/>
                        <div className={`relative flex h-full items-center gap-1 overflow-hidden rounded-md border px-3 shadow-md ${activeTrack === index ? 'border-white/40' : 'border-black/30'}`} style={{ backgroundColor: track.color }}>
                          <span className="absolute left-2 top-1 text-[9px] font-bold text-[#164f69]/70">{track.name}{track.audioUrl ? ' · Eleven Music' : ''}</span>
                          {track.pattern.concat(track.pattern, track.pattern).map((height, i) => <i key={i} className="min-w-[2px] flex-1 rounded-full bg-[#125474]/60" style={{ height: Math.max(5, height - 8), maxWidth: 5 }}/>) }
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pointer-events-none absolute inset-y-0 left-[calc(230px+18%)] z-30 w-px bg-[#fb9b6d]"/>
                </div> : <div className="grid min-h-[390px] place-items-center bg-[#21323a] p-8 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-[#263e4b] text-[#8fd9fb]"><Icon name="sparkles" size={24}/></span><h2 className="mt-4 text-xl font-bold text-white">Start with your first track</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9db2bc]">Describe an instrument, mood, rhythm, or scene and Cstar will create an editable region.</p><button onClick={openDescribe} className="focus-ring mt-5 rounded-lg bg-[#e5f2f8] px-5 py-2.5 text-sm font-bold text-[#17272f] hover:bg-white">Describe your first track</button></div></div>}

                {projectTracks.length > 0 && <button onClick={openDescribe} className="focus-ring flex h-12 w-[230px] items-center gap-2 border-r border-black/60 bg-[#24343c] px-4 text-xs font-bold text-[#b9d0da] hover:bg-[#293f49]"><span className="grid h-6 w-6 place-items-center rounded bg-[#17272f]"><Icon name="plus" size={14}/></span> Add another track</button>}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-black/70 bg-[#1c2b33] px-4 py-2 text-[10px] text-[#85908b]"><span>Snap: Smart</span><span>Zoom 100% · 44.1 kHz</span></div>
          </div>
        </section>
      )}

      {showDescribe && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#0d1f19]/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) closeDescribe() }} onKeyDown={(e) => { if (e.key === 'Escape') closeDescribe() }}>
          <section role="dialog" aria-modal="true" aria-labelledby="describe-title" className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-white/30 bg-white p-5 shadow-2xl md:p-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[#046492]"><Icon name="sparkles" size={18}/><span className="text-xs font-bold uppercase tracking-[.18em]">Add a track</span></div>
                <h2 id="describe-title" className="font-serif text-3xl font-bold">{trackType ? `Create ${trackType === 'drums' ? 'Drums' : trackType === 'melody' ? 'a Melodic Instrument' : 'Vocals'}` : 'Choose a track type'}</h2>
                <p className="mt-2 text-sm leading-6 text-[#607c89]">{trackType === 'drums' ? 'Build a four-second beat with eight keyboard pads and manually recorded layers.' : trackType ? 'Describe your idea in words or record a reference. You can use either option or both.' : 'What kind of sound would you like to add to this project?'}</p>
              </div>
              <button onClick={closeDescribe} aria-label="Close add track dialog" className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef7fb] text-xl hover:bg-[#e1e8e4]">×</button>
            </div>

            {!trackType ? (
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  { id: 'drums' as const, title: 'Drums', detail: 'Beats, percussion and rhythm', icon: 'volume' as const, color: '#f3d4bf' },
                  { id: 'melody' as const, title: 'Melodic Instrument', detail: 'Piano, strings, guitar and more', icon: 'sparkles' as const, color: '#cfe8f3' },
                  { id: 'vocals' as const, title: 'Vocals', detail: 'Singing, humming and spoken voice', icon: 'mic' as const, color: '#ddd5ee' },
                ].map(option => (
                  <button key={option.id} autoFocus={option.id === 'drums'} onClick={() => setTrackType(option.id)} className="focus-ring group flex min-h-48 flex-col items-start rounded-2xl border border-[#d7e8f0] p-5 text-left transition hover:-translate-y-1 hover:border-[#046492] hover:shadow-lg">
                    <span className="grid h-12 w-12 place-items-center rounded-xl text-[#075b83]" style={{ backgroundColor: option.color }}><Icon name={option.icon} size={23}/></span>
                    <strong className="mt-5 text-lg">{option.title}</strong>
                    <span className="mt-2 text-sm leading-5 text-[#6d7973]">{option.detail}</span>
                    <span className="mt-auto flex items-center gap-1 pt-5 text-xs font-bold text-[#046492]">Select <Icon name="chevron" size={15}/></span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <button onClick={() => { setTrackType(null); setIsRecording(false) }} className="focus-ring mt-5 flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-bold text-[#046492] hover:bg-[#e9f5fa]"><span className="rotate-180"><Icon name="chevron" size={16}/></span> Change track type</button>
                {trackType === 'drums' ? (
                  <div className="mt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="block text-sm font-bold">Beat layers</span>
                        <span className="mt-0.5 block text-xs text-[#526f7d]">4 second loop · all layers play together</span>
                      </div>
                      <button type="button" onClick={toggleDrumLoop} disabled={!drumLayers.some(layer => layer.hits.length)} className={`focus-ring flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40 ${isDrumLoopPlaying ? 'bg-[#fb9b6d] text-[#071c2b]' : 'bg-[#046492] text-white hover:bg-[#03577f]'}`}>
                        <Icon name={isDrumLoopPlaying ? 'pause' : 'play'} size={16}/>
                        {isDrumLoopPlaying ? 'Pause all layers' : 'Play all layers'} <kbd className="rounded border border-current/40 px-1.5 py-0.5 font-mono text-[10px]">G</kbd>
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2" aria-label="Drum layers">
                      {drumLayers.map(layer => (
                        <button key={layer.id} type="button" aria-pressed={layer.id === activeDrumLayerId} aria-label={`${layer.name}, ${layer.hits.length} hits${layer.id === activeDrumLayerId ? ', active' : ''}`} onClick={() => selectDrumLayer(layer.id)} className={`focus-ring rounded-xl border-2 px-3 py-2 text-left text-xs transition ${layer.id === activeDrumLayerId ? 'border-[#046492] bg-[#e4f3f9] text-[#071c2b]' : 'border-[#b8d3df] bg-white text-[#294b5f] hover:border-[#046492]'}`}>
                          <strong className="block">{layer.name}</strong>
                          <span className="mt-0.5 block">{layer.hits.length} {layer.hits.length === 1 ? 'hit' : 'hits'}{layer.id === activeDrumLayerId ? ' · Active' : ''}</span>
                        </button>
                      ))}
                      <button type="button" onClick={addDrumLayer} disabled={drumLayers.length >= 8 || isDrumRecording} className="focus-ring flex items-center gap-2 rounded-xl border-2 border-dashed border-[#6f8d9c] bg-white px-3 py-2 text-xs font-bold text-[#046492] hover:bg-[#eef7fb] disabled:cursor-not-allowed disabled:opacity-40">
                        <Icon name="plus" size={15}/> Add layer <kbd className="rounded border border-[#6f8d9c] bg-[#eef7fb] px-1.5 py-0.5 font-mono text-[10px]">H</kbd>
                      </button>
                    </div>

                    <div className="mt-3 grid gap-2 rounded-xl bg-[#eef7fb] p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <span className="block text-xs font-bold text-[#294b5f]">{isDrumRecording ? 'Recording' : 'Active'} {drumLayers.find(layer => layer.id === activeDrumLayerId)?.name}</span>
                        <span className="mt-1 block text-xs text-[#526f7d]" aria-live="polite" aria-atomic="true">{drumStatus}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" aria-pressed={isDrumRecording} onClick={toggleDrumRecording} className={`focus-ring rounded-lg px-3 py-2 text-xs font-bold ${isDrumRecording ? 'bg-[#fb9b6d] text-[#071c2b]' : 'bg-[#046492] text-white hover:bg-[#03577f]'}`}>
                          {isDrumRecording ? 'Stop Recording' : 'Start Recording'} <kbd className="ml-1 rounded border border-current/40 px-1.5 py-0.5 font-mono text-[10px]">R</kbd>
                        </button>
                      <button type="button" onClick={clearActiveDrumLayer} disabled={!drumLayers.find(layer => layer.id === activeDrumLayerId)?.hits.length} className="focus-ring rounded-lg px-2 py-1 text-xs font-bold text-[#526f7d] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">Clear active layer</button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {drumPads.map(pad => (
                        <button key={pad.id} type="button" aria-label={`${pad.name}, key ${pad.key === ';' ? 'semicolon' : pad.key}, ${drumLayers.find(layer => layer.id === activeDrumLayerId)?.hits.filter(hit => hit.id === pad.id).length || 0} hits in active layer`} onClick={() => triggerDrum(pad.id)} className={`focus-ring relative flex min-h-28 flex-col items-center justify-center rounded-2xl border-2 text-center transition active:scale-95 ${activeDrum === pad.id ? 'scale-95 border-[#046492] shadow-inner' : 'border-transparent shadow-sm hover:-translate-y-0.5'}`} style={{ backgroundColor: pad.color }}>
                          <kbd className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md border border-black/15 bg-white/70 font-mono text-xs font-bold text-[#26342e]">{pad.key}</kbd>
                          <Icon name={pad.id.includes('hi_hat') || pad.id === 'shaker' ? 'sparkles' : 'volume'} size={23}/>
                          <strong className="mt-2 text-sm">{pad.name}</strong>
                          <span className="mt-1 text-[11px] font-bold text-[#294b5f]">{drumLayers.find(layer => layer.id === activeDrumLayerId)?.hits.filter(hit => hit.id === pad.id).length || 0} hits</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 min-h-12 rounded-xl border border-[#e5f2f8] bg-[#f6fafc] p-3">
                      {isDrumRecording && drumLayers.find(layer => layer.id === activeDrumLayerId)?.hits.length ? (
                        <div className="flex flex-wrap gap-1.5">{drumLayers.find(layer => layer.id === activeDrumLayerId)?.hits.map((hit, index) => <span key={`${hit.name}-${hit.timeMs}-${index}`} className="rounded-md bg-[#dceff7] px-2 py-1 text-[11px] font-bold text-[#075b83]">{hit.name} · {(hit.timeMs / 1000).toFixed(2)}s</span>)}</div>
                      ) : drumLayers.find(layer => layer.id === activeDrumLayerId)?.hits.length ? (
                        <p className="text-xs font-bold text-[#294b5f]">{drumLayers.find(layer => layer.id === activeDrumLayerId)?.hits.length} committed hits in this layer. Press R to record the next layer.</p>
                      ) : (
                        <p className="text-xs text-[#526f7d]">{isDrumRecording ? 'Play A, S, D, F, J, K, L, or Semicolon to record the first hit.' : 'Pads are in audition mode. Press R to start recording; pad hits are not saved while recording is off.'}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <label htmlFor="track-description" className="mt-4 block text-sm font-bold">Describe the track</label>
                    <textarea autoFocus id="track-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={trackType === 'melody' ? 'For example: A warm cello melody that rises gently in the second half...' : 'For example: A quiet wordless vocal harmony with a breathy tone...'} className="focus-ring mt-2 min-h-28 w-full resize-none rounded-2xl border border-[#cbd4d0] bg-[#fbfcfb] p-4 text-[15px] leading-7 outline-none focus:border-[#046492]"/>
                  </>
                )}

                <div className={`mt-4 rounded-2xl border p-4 transition ${isRecording ? 'border-[#b54a40] bg-[#fff7f5]' : 'border-[#d7e8f0] bg-[#f3f9fc]'}`}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <button onClick={() => setIsRecording(!isRecording)} aria-label={isRecording ? 'Stop recording' : 'Start recording'} className={`focus-ring grid h-14 w-14 shrink-0 place-items-center rounded-full text-white shadow-md ${isRecording ? 'bg-[#b54a40]' : 'bg-[#046492]'}`}><span className={isRecording ? 'h-4 w-4 rounded-sm bg-white' : ''}>{!isRecording && <Icon name="mic" size={22}/>}</span></button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between"><div><strong className="block text-sm">{isRecording ? 'Recording reference…' : 'Record a musical reference'}</strong><span className="text-xs text-[#6b8794]">{isRecording ? 'Play, sing, or tap your idea' : 'Use your microphone to capture the idea'}</span></div><span className={`font-mono text-sm font-bold ${isRecording ? 'text-[#a43f36]' : 'text-[#6b8794]'}`}>{isRecording ? '00:08' : '00:00'}</span></div>
                      <div className="mt-3 flex h-8 items-center gap-1 overflow-hidden">{[8,18,12,26,16,30,10,22,15,28,12,20,8,24,14,30,18,10,22,16,28,12,18,8].map((height, i) => <i key={i} className={`w-1 flex-1 rounded-full ${isRecording ? 'bg-[#b54a40]' : 'bg-[#b8c4be]'}`} style={{ height: isRecording ? height : 3 }}/>)}</div>
                    </div>
                  </div>
                </div>

                <button onClick={() => setIsListening(!isListening)} className={`focus-ring mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border font-bold ${isListening ? 'border-[#a5483d] bg-[#fff2ef] text-[#8c352c]' : 'border-[#b8d3df] text-[#075b83] hover:bg-[#eef8fc]'}`}><Icon name={isListening ? 'pause' : 'mic'} size={17}/>{isListening ? 'Listening — tap to stop' : 'Dictate the description instead'}</button>
                {generationError && <p role="alert" className="mt-4 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm font-medium text-[#8f382f]">{generationError}</p>}
                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={closeDescribe} disabled={isGenerating} className="focus-ring rounded-xl px-5 py-3 font-bold text-[#526f7d] hover:bg-[#eef7fb] disabled:cursor-not-allowed disabled:opacity-50">Cancel</button><button onClick={addTrack} disabled={isGenerating} className="focus-ring flex min-w-40 items-center justify-center gap-2 rounded-xl bg-[#046492] px-5 py-3 font-bold text-white hover:bg-[#03577f] disabled:cursor-wait disabled:opacity-70"><Icon name="sparkles" size={18}/>{isGenerating ? 'Generating…' : trackType === 'vocals' ? 'Add vocal track' : 'Generate with Eleven Music'}</button></div>
              </>
            )}
          </section>
        </div>
      )}
      <button data-reader-ignore type="button" onClick={readCurrentPage} className="focus-ring fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-2xl border-2 border-[#046492] bg-white px-4 py-3 text-sm font-bold text-[#071c2b] shadow-xl hover:bg-[#eef7fb]" aria-label={readStatus === 'reading' ? 'Stop reading this page' : 'Read this page aloud'}>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${readStatus === 'reading' ? 'bg-[#fb9b6d] text-[#071c2b]' : 'bg-[#046492] text-white'}`}><Icon name={readStatus === 'reading' ? 'volume' : 'accessibility'} size={19}/></span>
        <span>{readStatus === 'loading' ? 'Preparing natural voice…' : readStatus === 'reading' ? `Reading with ${narrationSource === 'elevenlabs' ? 'ElevenLabs' : 'device voice'} — Space to stop` : 'Press Space to read this page'}</span>
      </button>
      <audio ref={audioRef} src={projectTracks[activeTrack]?.audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
    </main>
  )
}
