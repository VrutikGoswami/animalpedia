import { useEffect, useState } from 'react'
import { ExternalLink, RotateCcw } from 'lucide-react'
import type { AnimalMedia } from '../types'

export function EmbeddedHabitat({
  embed,
}: {
  embed: NonNullable<AnimalMedia['embed']>
}) {
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  )
  useEffect(() => {
    if (status !== 'loading') return
    const timer = setTimeout(() => setStatus('error'), 15000)
    return () => clearTimeout(timer)
  }, [status, attempt])
  return (
    <section className="embedded-habitat" aria-label={embed.title}>
      <div className="video-stage">
        <iframe
          key={attempt}
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(embed.videoId)}?rel=0&playsinline=1&mute=1&autoplay=0`}
          title={`${embed.title} by ${embed.credit.creator}`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      </div>
      <div className="embed-credit">
        <a href={embed.credit.sourceUrl} target="_blank" rel="noreferrer">
          Watch on YouTube / {embed.credit.creator} <ExternalLink size={14} />
        </a>
        {status === 'loading' && (
          <span role="status">Connecting to YouTube</span>
        )}
        {status === 'error' && (
          <span role="alert">YouTube could not be reached.</span>
        )}
        <button
          className="icon-button"
          aria-label="Reload video player"
          title="Reload video player"
          onClick={() => {
            setStatus('loading')
            setAttempt((value) => value + 1)
          }}
        >
          <RotateCcw size={17} />
        </button>
      </div>
      <p className="video-caption">{embed.caption}</p>
    </section>
  )
}
