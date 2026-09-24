import { useRef, type CSSProperties } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import photos from '../data/country-photos.json'
import countries from '../data/countries.json'
import { assetUrl } from '../assetUrl'
import { Flag } from './Flag'
import '../landing.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Positions keep the title clear while the image field expands around it.
const positions = [
  [83, 50, 25, 2],
  [23, 20, 19, 3],
  [64, 14, 18, -3],
  [42, 14, 12, 2],
  [15, 52, 23, -3],
  [85, 22, 13, -2],
  [31, 81, 16, -3],
  [67, 85, 18, 3],
  [5, 17, 12, -4],
  [92, 86, 14, -3],
  [48, 88, 9, 2],
  [9, 87, 12, 2],
]

export function CountryLanding({
  onAustralia,
  onCountries,
}: {
  onAustralia: () => void
  onCountries: () => void
}) {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          desktop: '(min-width: 760px)',
          mobile: '(max-width: 759px)',
          motion:
            '(prefers-reduced-motion: no-preference) and (min-height: 600px)',
        },
        (context) => {
          if (!context.conditions?.motion) return
          let disposed = false
          let depth:
            { update: (value: number) => void; dispose: () => void } | undefined
          const travel = { progress: 0 }
          void import('./countryDepth').then(({ createCountryDepth }) => {
            if (disposed) return
            try {
              depth = createCountryDepth(
                root.current!.querySelector('.country-field')!,
                Array.from(root.current!.querySelectorAll('.country-float')),
              )
              depth.update(travel.progress)
            } catch {
              /* The photographic layout remains usable without WebGL. */
            }
          })
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '.country-scene',
              start: () => `top ${window.innerWidth < 760 ? 72 : 80}px`,
              end: () => `+=${window.innerHeight * 3.8}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          timeline.to(
            travel,
            {
              progress: 1,
              duration: 1,
              onUpdate: () => depth?.update(travel.progress),
            },
            0,
          )
          timeline.to('.world-title', { scale: 0.86, duration: 1 }, 0)
          timeline.to('.world-progress i', { scaleX: 1, duration: 1 }, 0)
          return () => {
            disposed = true
            depth?.dispose()
          }
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )
  return (
    <main className="world-landing" id="main-content" ref={root}>
      <section className="country-scene" aria-labelledby="world-title">
        <div className="country-field">
          {photos.map((photo, index) => {
            const [x, y, width, rotation] = positions[index]
            const name = countries.find(
              (country) => country.code === photo.code,
            )!.name
            const available = photo.code === 'au'
            return (
              <button
                key={photo.code}
                className={`country-float country-${photo.code}`}
                disabled={!available}
                onClick={onAustralia}
                aria-label={`${name}: ${available ? 'Explore South Australia' : 'Coming soon'}`}
                style={
                  {
                    '--x': `${x}%`,
                    '--y': `${y}%`,
                    '--width': `${width}%`,
                    '--tilt': `${rotation}deg`,
                  } as CSSProperties
                }
              >
                <img
                  className="country-photo"
                  src={assetUrl(photo.src)}
                  alt={photo.place}
                  width="640"
                  height="420"
                  fetchPriority={available ? 'high' : 'auto'}
                />
                <span className="country-caption">
                  <Flag code={photo.code} />
                  <span>{name}</span>
                  {available ? (
                    <ArrowUpRight size={15} aria-hidden="true" />
                  ) : (
                    <small>Coming soon</small>
                  )}
                </span>
              </button>
            )
          })}
        </div>
        <div className="world-title">
          <p className="eyebrow">An interactive wildlife atlas</p>
          <h1 id="world-title">
            Animalia<span>.</span>
          </h1>
          <p className="world-subtitle">One planet. A world of life.</p>
          <button className="world-enter" onClick={onAustralia}>
            <Flag code="au" />
            Explore Australia
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
        <div className="world-scene-footer">
          <span>01 / THE WORLD</span>
          <div className="world-progress" aria-hidden="true">
            <i />
          </div>
          <button className="text-button" onClick={onCountries}>
            All countries <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
        <button className="collection-peek" onClick={onAustralia}>
          <span>Our first field collection</span>
          <span>
            South Australia <ArrowDown size={16} aria-hidden="true" />
          </span>
        </button>
      </section>
      <section className="world-collection" aria-labelledby="collection-title">
        <div className="collection-kicker">
          <span className="eyebrow">Our first field collection</span>
          <ArrowDown size={17} aria-hidden="true" />
        </div>
        <div className="collection-row">
          <div>
            <p className="collection-country">
              <Flag code="au" />
              Australia
            </p>
            <h2 id="collection-title">South Australia.</h2>
          </div>
          <p>
            From the open outback to the Southern Ocean.
            <br />
            Three species. Three ways of seeing the wild.
          </p>
          <button className="primary-button" onClick={onAustralia}>
            Enter collection <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
        <footer>
          <span>Animalia / A world worth knowing</span>
          <button className="text-button" onClick={onCountries}>
            Country index &amp; credits{' '}
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </footer>
      </section>
    </main>
  )
}
