import { ChevronDown, Globe2, ArrowUpRight } from 'lucide-react'
import { Flag } from './Flag'

export function Header({
  onAbout,
  onExplore,
  onHome,
  onCountries,
  australia,
}: {
  onAbout: () => void
  onExplore: () => void
  onHome: () => void
  onCountries: () => void
  australia: boolean
}) {
  return (
    <header className="site-header">
      <a
        href="#world"
        className="wordmark"
        onClick={(e) => {
          e.preventDefault()
          onHome()
        }}
      >
        Animalia<span>.</span>
      </a>
      <span className="descriptor">An interactive wildlife atlas</span>
      <div className="country-picker">
        <button
          className="country-toggle"
          aria-haspopup="dialog"
          onClick={onCountries}
        >
          {australia ? (
            <Flag code="au" />
          ) : (
            <Globe2 size={17} aria-hidden="true" />
          )}
          {australia ? 'Australia' : 'Countries'}
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Main navigation">
        <button onClick={onExplore}>Explore</button>
        <button onClick={onAbout}>
          About <ArrowUpRight size={13} aria-hidden="true" />
        </button>
      </nav>
    </header>
  )
}
