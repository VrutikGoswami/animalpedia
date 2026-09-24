import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  ImageOff,
  RotateCcw,
  X,
} from 'lucide-react'
import type { Animal } from '../types'
import '../encounter.css'

export function AnimalEncounter({
  animal,
  onOpen,
}: {
  animal: Animal
  onOpen: (mode: 'details' | 'habitat') => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({})
  const note = useRef<HTMLElement>(null)
  const photo = animal.media.discovery
  const point = animal.hotspots.find((item) => item.id === selected)
  const source = animal.sources.find((item) => item.id === point?.sourceId)
  const panelId = `${animal.id}-body-note`
  useEffect(() => {
    if (!selected || !window.matchMedia('(max-width: 1019px)').matches) return
    note.current?.focus({ preventScroll: true })
    note.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }, [selected])
  const close = () => {
    setSelected(null)
    if (selected) buttons.current[selected]?.focus()
  }

  return (
    <div
      className="chapter-body encounter"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && selected) {
          event.preventDefault()
          event.stopPropagation()
          close()
        }
      }}
    >
      <div className="chapter-copy">
        <div className="encounter-title">
          <p className="eyebrow">{animal.chapter}</p>
          <h1 id={`${animal.id}-title`}>{animal.commonName}</h1>
          <p className="scientific-name">{animal.scientificName}</p>
        </div>
        <div
          className="encounter-note-slot"
          id={panelId}
          aria-live="polite"
          aria-atomic="true"
        >
          {point ? (
            <section
              ref={note}
              tabIndex={-1}
              className="body-note-tile"
              key={point.id}
              aria-labelledby={`${panelId}-title`}
            >
              <div className="body-note-topline">
                <span className="micro">
                  Field detail / 0{animal.hotspots.indexOf(point) + 1}
                </span>
                <button
                  className="icon-button"
                  aria-label="Close body part note"
                  title="Close body part note"
                  onClick={close}
                >
                  <X size={17} aria-hidden="true" />
                </button>
              </div>
              <h2 id={`${panelId}-title`}>{point.title}</h2>
              <p>{point.description}</p>
              {source && (
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.publisher}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              )}
            </section>
          ) : (
            <div className="encounter-introduction">
              <p className="intro-copy">{animal.introduction}</p>
              <p className="habitat-label">
                {animal.habitatLabel} / {animal.region}
              </p>
            </div>
          )}
        </div>
        <div className="encounter-actions">
          <button className="primary-button" onClick={() => onOpen('habitat')}>
            Explore habitat <ArrowRight size={19} aria-hidden="true" />
          </button>
          <button
            className="underlined-button"
            onClick={() => onOpen('details')}
          >
            Meet the species <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="chapter-visual">
        <figure
          className="encounter-figure"
          data-photo-state={photo ? status : 'empty'}
          style={
            {
              '--photo-ratio': (photo?.width ?? 4) / (photo?.height ?? 3),
            } as CSSProperties
          }
        >
          <div
            className="encounter-photo"
            style={{
              aspectRatio: `${photo?.width ?? 4} / ${photo?.height ?? 3}`,
            }}
          >
            {photo && status !== 'error' && (
              <img
                key={attempt}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                decoding="async"
                onLoad={() => setStatus('ready')}
                onError={() => {
                  setStatus('error')
                  setSelected(null)
                }}
              />
            )}
            {photo &&
              status === 'ready' &&
              animal.hotspots.map((item) => (
                <button
                  key={item.id}
                  ref={(node) => {
                    buttons.current[item.id] = node
                  }}
                  className="photo-node"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  aria-label={`Inspect ${item.title}`}
                  aria-expanded={selected === item.id}
                  aria-controls={panelId}
                  onClick={() =>
                    setSelected(selected === item.id ? null : item.id)
                  }
                >
                  <span className="photo-node-dot" aria-hidden="true" />
                  <span className="photo-node-label" aria-hidden="true">
                    {item.title}
                  </span>
                </button>
              ))}
            {(!photo || status !== 'ready') && (
              <div className="encounter-photo-status" role="status">
                {status === 'error' || !photo ? (
                  <>
                    <ImageOff size={26} aria-hidden="true" />
                    <p>
                      {photo
                        ? 'Photograph unavailable'
                        : 'Photograph coming soon'}
                    </p>
                  </>
                ) : (
                  <p>Loading photograph...</p>
                )}
                {photo && status === 'error' && (
                  <button
                    className="text-button"
                    onClick={() => {
                      setStatus('loading')
                      setAttempt((value) => value + 1)
                    }}
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                    Retry photograph
                  </button>
                )}
              </div>
            )}
          </div>
          {photo && (
            <figcaption>
              <span>{photo.caption ?? photo.alt}</span>
              <span className="encounter-photo-credit">
                <a
                  href={photo.credit.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {photo.credit.creator}
                </a>{' '}
                /{' '}
                {photo.credit.licenseUrl ? (
                  <a
                    href={photo.credit.licenseUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {photo.credit.license}
                  </a>
                ) : (
                  photo.credit.license
                )}
              </span>
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  )
}
