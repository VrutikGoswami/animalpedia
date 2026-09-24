import { useCallback, useEffect, useState } from 'react'
import { Header } from './components/Header'
import { DiscoverScreen } from './components/DiscoverScreen'
import { AnimalDialog, type AnimalMode } from './components/AnimalDialog'
import { Modal } from './components/Modal'
import { animals } from './data/animals'
import { CountryLanding } from './components/CountryLanding'
import { CountryDirectory } from './components/CountryDirectory'

export default function App() {
  const [australia, setAustralia] = useState(
    () => location.hash === '#australia',
  )
  const [directory, setDirectory] = useState(false)
  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState<{
    index: number
    mode: AnimalMode
  } | null>(null)
  const [about, setAbout] = useState(false)
  useEffect(() => {
    const navigate = () => {
      if (!['', '#world', '#australia'].includes(location.hash)) return
      setAustralia(location.hash === '#australia')
      setDirectory(false)
      setOpened(null)
      setAbout(false)
      setActive(0)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])
  useEffect(() => {
    // Wait until the previous page's pinned spacer has been removed.
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [australia])
  const enterAustralia = () => {
    setDirectory(false)
    if (australia) goTo(0)
    else window.location.assign('#australia')
  }
  const onActive = useCallback((index: number) => setActive(index), [])
  const goTo = (index: number) => {
    const node = document.getElementById(animals[index].id)
    const target = document.getElementById('atlas-stage')
    const top =
      target?.dataset.scrollStart !== undefined
        ? Number(target.dataset.scrollStart) +
          Number(target.dataset.scrollDistance) * (index / (animals.length - 1))
        : (node?.getBoundingClientRect().top ?? 0) +
          window.scrollY -
          (window.innerWidth < 760 ? 148 : 80)
    window.scrollTo({
      top,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header
        australia={australia}
        onAbout={() => setAbout(true)}
        onExplore={enterAustralia}
        onHome={() => {
          window.location.assign('#world')
          window.scrollTo({ top: 0, behavior: 'instant' })
        }}
        onCountries={() => setDirectory(true)}
      />
      {australia ? (
        <DiscoverScreen
          animals={animals}
          active={active}
          onActive={onActive}
          goTo={goTo}
          onOpen={(index, mode) => setOpened({ index, mode })}
        />
      ) : (
        <CountryLanding
          onAustralia={enterAustralia}
          onCountries={() => setDirectory(true)}
        />
      )}
      {directory && (
        <CountryDirectory
          onClose={() => setDirectory(false)}
          onAustralia={enterAustralia}
        />
      )}
      {opened && (
        <AnimalDialog
          key={animals[opened.index].id}
          animal={animals[opened.index]}
          index={opened.index}
          initialMode={opened.mode}
          onClose={() => setOpened(null)}
        />
      )}
      {about && (
        <Modal
          onClose={() => setAbout(false)}
          label="About Animalia"
          className="about-dialog"
        >
          <p className="eyebrow">A world worth knowing</p>
          <h2>Animalia.</h2>
          <p>An interactive wildlife atlas, beginning in South Australia.</p>
          <p>
            From the open outback to the Southern Ocean, this first collection
            meets three animals in the places they call home.
          </p>
          <div className="about-region">
            <span>Collection 01</span>
            <strong>Australia</strong>
            <span>South Australia</span>
          </div>
          <p className="small-copy">
            A hackathon prototype with original 3D illustrations, credited
            photography and observational films. Some observations were recorded
            in zoos and are labelled accordingly. Further countries are coming
            soon.
          </p>
        </Modal>
      )}
    </>
  )
}
