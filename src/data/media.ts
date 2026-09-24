import type { AnimalMedia, Still, Credit } from '../types'
import sources from './field-sources.json'
import { assetUrl } from '../assetUrl'

function credit(id: keyof typeof sources): Credit {
  const source = sources[id]
  return {
    creator: source.creator,
    sourceUrl: source.source_page,
    license: source.license,
    licenseUrl: source.license_url || undefined,
  }
}
function still(id: keyof typeof sources, alt: string): Still {
  return { src: assetUrl(sources[id].src), alt, kind: 'photo', credit: credit(id) }
}
const kangaroo = still(
  'kangaroo-photo',
  'Red kangaroo grazing at Binder Park Zoo, Michigan. Photograph by Ltshears.',
)
const mouse = still(
  'mouse',
  'Spinifex hopping mouse under red nocturnal-house lighting at Taronga Zoo, Sydney. Photograph by Sardaka.',
)
const seaLion = still(
  'sea-lion',
  'Australian sea lion resting at Seal Bay, Kangaroo Island, South Australia. Photograph by Peterdownunder.',
)

export const media: Record<string, AnimalMedia> = {
  kangaroo: {
    discovery: kangaroo,
    thumbnail: kangaroo,
    anatomy: kangaroo,
    poster: {
      src: assetUrl('/assets/kangaroo/poster.jpg'),
      alt: 'Frame from the red-kangaroo observation at San Diego Zoo.',
      kind: 'photo',
      credit: credit('kangaroo-film'),
    },
    clips: [
      {
        id: 'zoo-observation',
        label: 'Red kangaroo / San Diego Zoo',
        src: assetUrl(sources['kangaroo-film'].src),
        type: 'video/webm',
        caption:
          'Captive observation at San Diego Zoo, California. This short red-kangaroo study is not footage of wild South Australian habitat. Wikimedia Commons 1080p transcode; no additional edits.',
        credit: credit('kangaroo-film'),
      },
    ],
  },
  'spinifex-mouse': {
    discovery: mouse,
    thumbnail: still(
      'mouse-natural',
      'Spinifex hopping mouse at Sydney Wildlife World. Photograph by Dcoetzee.',
    ),
    anatomy: mouse,
    poster: mouse,
    habitatNote:
      'Taronga Zoo, Sydney. Red lighting in the nocturnal house; this is a captive observation, not a photograph of wild South Australia. Verified habitat footage is still pending.',
    clips: [],
  },
  'australian-sea-lion': {
    discovery: seaLion,
    thumbnail: seaLion,
    anatomy: seaLion,
    poster: null,
    clips: [
      {
        id: 'baird-bay',
        label: 'Baird Bay / South Australia',
        src: assetUrl(sources['sea-lion-film'].src),
        type: 'video/webm',
        caption:
          'Australian sea lions and Indo-Pacific bottlenose dolphins in Baird Bay, South Australia. Film by Matthieu VAUTRIN. The Commons version has its original audio and some sections removed; no further editorial changes.',
        credit: credit('sea-lion-film'),
      },
    ],
  },
}
