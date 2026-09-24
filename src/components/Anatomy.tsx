import { useRef, useState } from 'react'
import { ScanSearch, X, ExternalLink } from 'lucide-react'
import type { Animal } from '../types'

export function Anatomy({ animal }: { animal: Animal }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({})
  const hotspot = animal.hotspots.find((item) => item.id === selected)
  const source = animal.sources.find((item) => item.id === hotspot?.sourceId)
  const close = () => {
    setSelected(null)
    if (selected) buttons.current[selected]?.focus()
  }
  if (!animal.media.anatomy || failed)
    return (
      <div className="anatomy-empty">
        <ScanSearch size={32} strokeWidth={1.3} />
        <h3>A closer look.</h3>
        <p>
          {failed
            ? 'The anatomy photograph could not be loaded.'
            : 'Anatomy photography and field notes are coming soon.'}
        </p>
      </div>
    )
  return (
    <div
      className="anatomy-layout"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && selected) {
          event.preventDefault()
          event.stopPropagation()
          close()
        }
      }}
    >
      <div className="anatomy-image">
        <img
          src={animal.media.anatomy.src}
          alt={animal.media.anatomy.alt}
          onError={() => setFailed(true)}
        />
        {animal.hotspots.map((item, index) => (
          <button
            ref={(node) => {
              buttons.current[item.id] = node
            }}
            key={item.id}
            className="hotspot"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            aria-label={`Inspect ${item.title}`}
            aria-pressed={selected === item.id}
            onClick={() => setSelected(item.id)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="anatomy-note" aria-live="polite">
        {hotspot ? (
          <>
            <button
              className="icon-button"
              aria-label="Close anatomy note"
              onClick={close}
            >
              <X size={18} />
            </button>
            <h3>{hotspot.title}</h3>
            <p>{hotspot.description}</p>
            {source && (
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.publisher} <ExternalLink size={14} />
              </a>
            )}
          </>
        ) : (
          <p>
            {animal.hotspots.length
              ? 'Anatomy notes'
              : 'Field notes are coming soon.'}
          </p>
        )}
      </div>
    </div>
  )
}
