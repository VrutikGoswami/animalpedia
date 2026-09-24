import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Modal } from './Modal'
import { AnimalImage } from './AnimalImage'
import { Anatomy } from './Anatomy'
import { HabitatPlayer } from './HabitatPlayer'
import type { Animal } from '../types'
import { models } from '../data/models'

export type AnimalMode = 'details' | 'habitat' | 'anatomy'
export function AnimalDialog({
  animal,
  index,
  initialMode,
  onClose,
}: {
  animal: Animal
  index: number
  initialMode: AnimalMode
  onClose: () => void
}) {
  const [mode, setMode] = useState(initialMode)
  const [credits, setCredits] = useState(false)
  const [selectedClip, setSelectedClip] = useState(0)
  const allCredits = [
    animal.media.embed?.credit,
    models[animal.id]?.poster.credit,
    animal.media.discovery?.credit,
    animal.media.anatomy?.credit,
    animal.media.poster?.credit,
    ...animal.media.clips.map((item) => item.credit),
  ].filter((item) => item != null)
  return (
    <Modal
      onClose={onClose}
      label={animal.commonName}
      className="animal-dialog"
    >
      <div className="dialog-topline">
        <button className="text-button" onClick={onClose}>
          <ArrowLeft size={16} aria-hidden="true" />
          All animals
        </button>
        <span>Australia / South Australia</span>
      </div>
      <div className="dialog-title">
        <div>
          <p className="eyebrow">{animal.habitatLabel}</p>
          <h2>{animal.commonName}</h2>
          <p className="scientific-name">{animal.scientificName}</p>
        </div>
        <span className="dialog-index">0{index + 1}</span>
      </div>
      <nav className="view-tabs" aria-label="Animal views">
        {(['details', 'habitat', 'anatomy'] as const).map((item) => (
          <button
            key={item}
            aria-current={mode === item ? 'page' : undefined}
            onClick={() => setMode(item)}
          >
            {item === 'details'
              ? 'Overview'
              : item === 'habitat'
                ? 'Habitat'
                : 'Anatomy'}
          </button>
        ))}
      </nav>
      {mode === 'details' && (
        <div className="species-overview">
          <div className="overview-image">
            <AnimalImage
              asset={
                animal.media.discovery ?? models[animal.id]?.poster ?? null
              }
              name={animal.commonName}
              index={index}
            />
            {animal.media.discovery && (
              <p className="photo-location">{animal.media.discovery.alt}</p>
            )}
          </div>
          <div>
            <h3>{animal.introduction}</h3>
            <p>{animal.description}</p>
            <p className="habitat-label">{animal.region}</p>
            <button
              className="primary-button"
              onClick={() => setMode('habitat')}
            >
              Explore habitat
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
      {mode === 'habitat' && (
        <HabitatPlayer
          animal={animal}
          selected={selectedClip}
          onSelect={setSelectedClip}
        />
      )}
      {mode === 'anatomy' && <Anatomy animal={animal} />}
      {mode === 'anatomy' && (
        <button className="text-button" onClick={() => setMode('habitat')}>
          <ArrowLeft size={16} aria-hidden="true" />
          Return to habitat
        </button>
      )}
      <div className="dialog-footer">
        <span>{animal.region}</span>
        <button
          className="underlined-button"
          onClick={() => setCredits(!credits)}
          aria-expanded={credits}
        >
          Sources & credits
        </button>
      </div>
      {credits && (
        <section className="credits">
          <h3>Field references</h3>
          {animal.sources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.publisher}: {source.title}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          ))}
          {allCredits.length ? (
            allCredits.map((credit, i) => (
              <p key={i}>
                <a href={credit.sourceUrl} target="_blank" rel="noreferrer">
                  {credit.creator}
                </a>{' '}
                /{' '}
                {credit.licenseUrl ? (
                  <a href={credit.licenseUrl} target="_blank" rel="noreferrer">
                    {credit.license}
                  </a>
                ) : (
                  credit.license
                )}
              </p>
            ))
          ) : (
            <p>
              Media credits will accompany the field photography and footage.
            </p>
          )}
        </section>
      )}
    </Modal>
  )
}
