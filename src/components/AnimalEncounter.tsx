import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  const photoFrame = useRef<HTMLDivElement>(null)
  const photo = animal.media.discovery
  const point = animal.hotspots.find((item) => item.id === selected)
  const source = animal.sources.find((item) => item.id === point?.sourceId)
  const panelId = `${animal.id}-body-note`
  useLayoutEffect(() => {
    const frame = photoFrame.current
    const tile = note.current
    if (!point || !frame || !tile) return
    const place = () => {
      const width = frame.clientWidth
      const height = frame.clientHeight
      const w = tile.offsetWidth
      const h = tile.offsetHeight
      const x = (width * point.x) / 100
      const y = (height * point.y) / 100
      const inset = 10
      const candidates = [
        [x + 28, y - h / 2],
        [x - w - 28, y - h / 2],
        [x - w / 2, y - h - 28],
        [x - w / 2, y + 28],
        [inset, inset],
        [width - w - inset, inset],
        [inset, height - h - inset],
        [width - w - inset, height - h - inset],
      ].map(([left, top]) => ({
        left: Math.max(inset, Math.min(left, width - w - inset)),
        top: Math.max(inset, Math.min(top, height - h - inset)),
      }))
      // Prefer nearby placements that leave the selected dot and other nodes clear.
      const score = ({ left, top }: { left: number; top: number }) => {
        const covered = animal.hotspots.reduce((sum, item) => {
          const px = (width * item.x) / 100
          const py = (height * item.y) / 100
          return (
            sum +
            (px + 22 > left &&
            px - 22 < left + w &&
            py + 22 > top &&
            py - 22 < top + h
              ? item.id === point.id
                ? 1000000
                : 100000
              : 0)
          )
        }, 0)
        return covered + Math.hypot(left + w / 2 - x, top + h / 2 - y)
      }
      const best = candidates.sort((a, b) => score(a) - score(b))[0]
      tile.style.left = `${best.left}px`
      tile.style.top = `${best.top}px`
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(frame)
    observer.observe(tile)
    return () => observer.disconnect()
  }, [point, animal.hotspots])
  useEffect(() => {
    if (!selected) return
    note.current?.focus({ preventScroll: true })
    if (window.matchMedia('(max-width: 1019px)').matches)
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
        <div className="encounter-note-slot">
          <div className="encounter-introduction">
            <p className="intro-copy">{animal.introduction}</p>
            <p className="habitat-label">
              {animal.habitatLabel} / {animal.region}
            </p>
          </div>
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
            ref={photoFrame}
            className="encounter-photo"
            onPointerDown={(event) => {
              if (
                selected &&
                event.target instanceof Element &&
                !event.target.closest('.photo-node, .body-note-tile')
              )
                close()
            }}
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
                  aria-controls={selected === item.id ? panelId : undefined}
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
            {point && status === 'ready' && (
              <section
                ref={note}
                id={panelId}
                tabIndex={-1}
                className="body-note-tile"
                key={point.id}
                aria-labelledby={`${panelId}-title`}
              >
                <div className="body-note-topline">
                  <h2 id={`${panelId}-title`}>{point.title}</h2>
                  <button
                    className="icon-button"
                    aria-label="Close body part note"
                    title="Close body part note"
                    onClick={close}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
                <div
                  className="body-note-content"
                  tabIndex={0}
                  role="region"
                  aria-label={`${point.title} information`}
                >
                  <p>{point.description}</p>
                </div>
                {source && (
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.publisher}
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                )}
              </section>
            )}
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
