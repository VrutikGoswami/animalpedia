import { lazy, Suspense, useRef } from 'react'
import { ArrowDown, ArrowUpRight, ArrowRight, MapPin } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { AnimalImage } from './AnimalImage'
import type { Animal } from '../types'
import { models } from '../data/models'

const ModelViewer = lazy(() => import('./ModelViewer'))

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function DiscoverScreen({
  animals,
  active,
  onActive,
  onOpen,
  goTo,
  suspended = false,
}: {
  animals: Animal[]
  active: number
  onActive: (index: number) => void
  onOpen: (index: number, mode: 'details' | 'habitat' | 'anatomy') => void
  goTo: (index: number) => void
  suspended?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const chapters = gsap.utils.toArray<HTMLElement>(
        '.animal-chapter',
        root.current,
      )
      mm.add(
        {
          cinematic:
            '(min-width: 1020px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)',
          standard:
            '(max-width: 1019px), (max-height: 649px), (prefers-reduced-motion: reduce)',
        },
        (context) => {
          const stage =
            root.current!.querySelector<HTMLElement>('.atlas-chapters')!
          if (!context.conditions?.cinematic) {
            chapters.forEach((chapter, index) => {
              ScrollTrigger.create({
                trigger: chapter,
                start: 'top 55%',
                end: 'bottom 55%',
                onToggle: (self) => {
                  if (self.isActive) onActive(index)
                },
              })
            })
            return
          }
          stage.classList.add('cinematic')
          let current = -1
          const activate = (index: number) => {
            if (index === current) return
            current = index
            chapters.forEach((chapter, i) => {
              chapter.inert = i !== index
              chapter.setAttribute('aria-hidden', String(i !== index))
            })
            onActive(index)
          }
          activate(0)
          gsap.set(chapters.slice(1), { autoAlpha: 0 })
          const timeline = gsap.timeline({
            onUpdate: function () {
              activate(Math.round(this.progress() * (chapters.length - 1)))
            },
            scrollTrigger: {
              trigger: stage,
              start: 'top 80px',
              end: () => `+=${window.innerHeight * 2.8}`,
              pin: true,
              scrub: 0.65,
              onRefresh: (self) => {
                stage.dataset.scrollStart = String(self.start)
                stage.dataset.scrollDistance = String(self.end - self.start)
              },
            },
          })
          chapters.forEach((chapter, index) => {
            if (index === 0) return
            const previous = chapters[index - 1]
            const start = (index - 1) * 1.6 + 0.3
            timeline
              .to(
                previous.querySelector('.chapter-visual'),
                {
                  scale: 1.18,
                  y: -110,
                  rotation: -3,
                  opacity: 0,
                  duration: 1.1,
                  ease: 'power1.in',
                },
                start,
              )
              .to(
                previous.querySelector('.chapter-copy'),
                { y: -38, opacity: 0, duration: 0.65 },
                start,
              )
              .to(previous, { autoAlpha: 0, duration: 0.1 }, start + 1)
              .to(chapter, { autoAlpha: 1, duration: 0.2 }, start + 0.5)
              .fromTo(
                chapter.querySelector('.chapter-visual'),
                { scale: 0.76, y: 120, x: 50, rotation: 4, opacity: 0 },
                {
                  scale: 1,
                  y: 0,
                  x: 0,
                  rotation: 0,
                  opacity: 1,
                  duration: 0.8,
                  ease: 'power2.out',
                },
                start + 0.5,
              )
              .fromTo(
                chapter.querySelector('.chapter-copy'),
                { y: 38, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.65 },
                start + 0.65,
              )
          })
          return () => {
            stage.classList.remove('cinematic')
            delete stage.dataset.scrollStart
            delete stage.dataset.scrollDistance
            chapters.forEach((chapter) => {
              chapter.inert = false
              chapter.removeAttribute('aria-hidden')
            })
          }
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )
  return (
    <main id="main-content" ref={root}>
      <aside className="species-rail" aria-label="Australian animals">
        <span className="micro rail-heading">Field index</span>
        {animals.map((animal, index) => (
          <button
            key={animal.id}
            className={`species-link ${active === index ? 'active' : ''}`}
            aria-current={active === index ? 'true' : undefined}
            onClick={() => goTo(index)}
          >
            <div className="rail-image">
              <AnimalImage
                asset={
                  animal.media.thumbnail ??
                  models[animal.id]?.poster ??
                  animal.media.discovery
                }
                name={animal.commonName}
                index={index}
                small
              />
            </div>
            <span className="rail-number">0{index + 1}</span>
            <span className="rail-name">{animal.shortName}</span>
          </button>
        ))}
        <div className="rail-region">
          <MapPin size={14} aria-hidden="true" />
          <span>
            Australia
            <br />
            <strong>South Australia</strong>
          </span>
        </div>
      </aside>
      <div className="atlas-chapters" id="atlas-stage">
        {animals.map((animal, index) => (
          <section
            key={animal.id}
            id={animal.id}
            className={`animal-chapter chapter-${index}`}
            aria-labelledby={`${animal.id}-title`}
          >
            <div className="chapter-topline">
              <span>
                Australia <span className="separator">/</span> South Australia
              </span>
              <span>Field notes, 0{index + 1}</span>
            </div>
            <div className="chapter-body">
              <div className="chapter-copy">
                <p className="eyebrow">{animal.chapter}</p>
                <h1 id={`${animal.id}-title`}>{animal.commonName}</h1>
                <p className="scientific-name">{animal.scientificName}</p>
                <p className="intro-copy">{animal.introduction}</p>
                <p className="habitat-label">
                  {animal.habitatLabel} <span aria-hidden="true">/</span>{' '}
                  {animal.region}
                </p>
                <button
                  className="primary-button"
                  onClick={() => onOpen(index, 'habitat')}
                >
                  Explore habitat <ArrowRight size={19} aria-hidden="true" />
                </button>
                <button
                  className="underlined-button"
                  onClick={() => onOpen(index, 'details')}
                >
                  Meet the species <ArrowUpRight size={15} aria-hidden="true" />
                </button>
              </div>
              <div className="chapter-visual">
                {active === index && !suspended && models[animal.id] ? (
                  <Suspense
                    fallback={
                      <AnimalImage
                        asset={models[animal.id].poster}
                        name={animal.commonName}
                        index={index}
                      />
                    }
                  >
                    <ModelViewer
                      model={models[animal.id]}
                      name={animal.commonName}
                    />
                  </Suspense>
                ) : (
                  <AnimalImage
                    asset={models[animal.id]?.poster ?? animal.media.discovery}
                    name={animal.commonName}
                    index={index}
                  />
                )}
                <button
                  className="visual-label"
                  aria-label={`Meet ${animal.commonName}`}
                  onClick={() => onOpen(index, 'details')}
                >
                  <span>{animal.shortName}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="chapter-bottomline">
              <span>
                01 collection <span className="separator">/</span> 03 encounters
              </span>
              <button onClick={() => goTo(index === 2 ? 0 : index + 1)}>
                {index === 2 ? 'Back to the beginning' : 'Next encounter'}{' '}
                <ArrowDown size={17} aria-hidden="true" />
              </button>
            </div>
          </section>
        ))}
      </div>
      <div className="atlas-progress" aria-hidden="true">
        <span>
          0{active + 1} <span>/ 03</span>
        </span>
        <div>
          <i style={{ transform: `translateX(${active * 100}%)` }} />
        </div>
        <span>South Australia collection</span>
      </div>
    </main>
  )
}
