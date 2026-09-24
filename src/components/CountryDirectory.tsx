import { useState } from 'react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import countries from '../data/countries.json'
import photos from '../data/country-photos.json'
import { Modal } from './Modal'
import { Flag } from './Flag'

export function CountryDirectory({
  onClose,
  onAustralia,
}: {
  onClose: () => void
  onAustralia: () => void
}) {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLocaleLowerCase('en')
  const filtered = countries.filter(
    (country) =>
      country.name.toLocaleLowerCase('en').includes(normalized) ||
      country.code === normalized,
  )
  return (
    <Modal label="World atlas" onClose={onClose} className="country-directory">
      <p className="eyebrow">The world atlas</p>
      <h2>Choose a country.</h2>
      <p className="directory-intro">
        Our first collection begins in Australia. More of the world is coming
        soon.
      </p>
      <label className="country-search">
        <Search size={19} aria-hidden="true" />
        <input
          type="search"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              event.stopPropagation()
              onClose()
            }
          }}
          aria-label="Search countries and territories"
          placeholder="Search countries and territories"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button
            className="icon-button"
            aria-label="Clear search"
            onClick={() => setQuery('')}
          >
            <X size={17} />
          </button>
        )}
      </label>
      <p className="directory-count" role="status">
        {filtered.length} countries &amp; territories
      </p>
      <div className="country-results">
        {filtered.map((country) => (
          <button
            key={country.code}
            disabled={country.code !== 'au'}
            onClick={onAustralia}
          >
            <Flag code={country.code} />
            <span>
              {country.name}
              <small>
                {country.code === 'au'
                  ? 'South Australia collection'
                  : 'Coming soon'}
              </small>
            </span>
            {country.code === 'au' && (
              <ArrowUpRight size={17} aria-hidden="true" />
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="no-countries">No countries match "{query}".</p>
        )}
      </div>
      <details className="country-credits">
        <summary>Photography &amp; flag credits</summary>
        <p>
          Country names and flag images:{' '}
          <a
            href="https://flagpedia.net/download/api"
            target="_blank"
            rel="noreferrer"
          >
            Flagpedia / FlagCDN
          </a>
          . Directory includes territories and Kosovo; inclusion is geographic,
          not a statement of sovereignty.
        </p>
        {photos.map((photo) => (
          <p key={photo.code}>
            <a href={photo.sourceUrl} target="_blank" rel="noreferrer">
              {photo.place}
            </a>{' '}
            by {photo.creator}.{' '}
            <a href={photo.licenseUrl} target="_blank" rel="noreferrer">
              {photo.license}
            </a>
            . Resized; cropped for display.
          </p>
        ))}
      </details>
    </Modal>
  )
}
