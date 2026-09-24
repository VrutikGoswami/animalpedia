import { useEffect, useRef, useState } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  Film,
  Maximize2,
} from 'lucide-react'
import type { Animal, Clip } from '../types'

function Player({
  clip,
  poster,
  muted,
  setMuted,
}: {
  clip: Clip
  poster?: string
  muted: boolean
  setMuted: (value: boolean) => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [playing, setPlaying] = useState(false)
  const [retry, setRetry] = useState(0)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)
  const time = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
  const clearLoading = () => {
    if (timer.current) clearTimeout(timer.current)
  }
  const ready = () => {
    clearLoading()
    setStatus('ready')
  }
  useEffect(() => {
    const video = ref.current
    if (video) {
      video.src = clip.src
      video.load()
    }
    timer.current = setTimeout(() => {
      video?.pause()
      setStatus('error')
    }, 12000)
    return () => {
      clearLoading()
      video?.pause()
      video?.removeAttribute('src')
      video?.load()
    }
  }, [retry, clip.src])
  const play = async () => {
    const video = ref.current
    if (!video) return
    if (!video.paused) {
      video.pause()
      return
    }
    if (
      video.ended ||
      (clip.end !== undefined && video.currentTime >= clip.end)
    )
      video.currentTime = clip.start ?? 0
    try {
      await video.play()
    } catch {
      setStatus('error')
    }
  }
  return (
    <>
      <div className="video-stage">
        <video
          key={retry}
          ref={ref}
          src={clip.src}
          poster={poster}
          muted={muted}
          playsInline
          preload="metadata"
          aria-label={clip.label}
          onLoadedMetadata={(event) => {
            setDuration(
              Number.isFinite(event.currentTarget.duration)
                ? event.currentTarget.duration
                : 0,
            )
            if (clip.start !== undefined)
              event.currentTarget.currentTime = clip.start
            ready()
          }}
          onCanPlay={ready}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => {
            clearLoading()
            setStatus('error')
          }}
          onTimeUpdate={(event) => {
            setPosition(event.currentTarget.currentTime)
            if (
              clip.end !== undefined &&
              event.currentTarget.currentTime >= clip.end
            )
              event.currentTarget.pause()
          }}
        >
          {clip.captions && (
            <track
              kind="captions"
              src={clip.captions}
              srcLang="en"
              label="English"
              default
            />
          )}
        </video>
        {status !== 'ready' && (
          <div
            className="video-state"
            role={status === 'error' ? 'alert' : 'status'}
          >
            <Film size={26} aria-hidden="true" />
            <p>
              {status === 'error'
                ? 'This footage could not be loaded.'
                : 'Loading footage'}
            </p>
            {status === 'error' && (
              <button
                className="secondary-button"
                onClick={() => {
                  setStatus('loading')
                  setPlaying(false)
                  setRetry((value) => value + 1)
                }}
              >
                <RotateCcw size={16} aria-hidden="true" />
                Try again
              </button>
            )}
          </div>
        )}
      </div>
      <div className="playback-bar">
        <button
          className="icon-button"
          disabled={status !== 'ready'}
          onClick={play}
          aria-label={playing ? 'Pause video' : 'Play video'}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          className="icon-button"
          onClick={() => setMuted(!muted)}
          aria-label={muted ? 'Enable sound' : 'Mute video'}
          title={muted ? 'Enable sound' : 'Mute'}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <span>{clip.label}</span>
        <a href={clip.credit.sourceUrl} target="_blank" rel="noreferrer">
          {clip.credit.creator} <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
      <div className="video-timeline">
        <span>{time(position)}</span>
        <input
          type="range"
          aria-label="Video position"
          min={0}
          max={duration || 1}
          step={0.1}
          value={position}
          disabled={status !== 'ready'}
          onChange={(event) => {
            const value = Number(event.target.value)
            if (ref.current) ref.current.currentTime = value
            setPosition(value)
          }}
        />
        <span>{time(duration)}</span>
        <button
          className="icon-button"
          aria-label="Fullscreen video"
          title="Fullscreen"
          disabled={status !== 'ready' || !document.fullscreenEnabled}
          onClick={() => {
            void ref.current?.parentElement?.requestFullscreen().catch(() => {})
          }}
        >
          <Maximize2 size={17} />
        </button>
      </div>
      <p className="video-caption">{clip.caption}</p>
    </>
  )
}

export function HabitatPlayer({ animal }: { animal: Animal }) {
  const [selected, setSelected] = useState(0)
  const [muted, setMuted] = useState(true)
  const clip = animal.media.clips[selected]
  if (!clip && animal.media.poster)
    return (
      <figure className="habitat-photo-study">
        <img src={animal.media.poster.src} alt={animal.media.poster.alt} />
        <figcaption>
          <span className="eyebrow">Photographic observation</span>
          <p>{animal.media.habitatNote}</p>
          <a
            href={animal.media.poster.credit.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            {animal.media.poster.credit.creator} /{' '}
            {animal.media.poster.credit.license} <ExternalLink size={14} />
          </a>
        </figcaption>
      </figure>
    )
  if (!clip)
    return (
      <>
        <div className="video-stage empty-habitat">
          {animal.media.poster && (
            <img src={animal.media.poster.src} alt={animal.media.poster.alt} />
          )}
          <div className="video-state">
            <Film size={28} strokeWidth={1.3} aria-hidden="true" />
            <p>A window into the wild.</p>
            <span>Habitat footage is coming soon.</span>
          </div>
          <span className="stage-location">{animal.region}</span>
        </div>
        <div className="playback-bar">
          <button
            className="icon-button"
            disabled
            aria-label="Play video (footage unavailable)"
          >
            <Play size={20} />
          </button>
          <span>Awaiting field footage</span>
          <span className="micro">{animal.habitatLabel}</span>
        </div>
      </>
    )
  return (
    <>
      <Player
        key={clip.id}
        clip={clip}
        poster={animal.media.poster?.src}
        muted={muted}
        setMuted={setMuted}
      />
      {animal.media.clips.length > 1 && (
        <div className="clip-list" aria-label="Habitat footage">
          {animal.media.clips.map((item, index) => (
            <button
              key={item.id}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
