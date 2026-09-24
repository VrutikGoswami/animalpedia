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
  return {
    src: assetUrl(sources[id].src),
    alt,
    kind: 'photo',
    credit: credit(id),
  }
}
const kangaroo: Still = {
  ...still(
    'kangaroo-habitat',
    'Two red kangaroos in grassland at Brookfield Conservation Park, South Australia. Photograph by Donald Hobern.',
  ),
  width: 4760,
  height: 3570,
  caption: 'Brookfield Conservation Park, South Australia',
}
const mouse: Still = {
  ...still(
    'mouse-habitat',
    'Two spinifex hopping mice beside a rock on leaf litter. Photograph by Stephen Michael Barnett; location and wild status unverified.',
  ),
  width: 2754,
  height: 1747,
  caption: 'Photographic observation / location and wild status unverified',
}
const seaLion: Still = {
  ...still(
    'sea-lion',
    'Australian sea lion resting at Seal Bay, Kangaroo Island, South Australia. Photograph by Peterdownunder.',
  ),
  width: 1920,
  height: 1440,
  caption: 'Seal Bay, Kangaroo Island, South Australia',
}

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
    embed: {
      videoId: '88f9w3pzaVs',
      title: 'The Spinifex Hopping-mouse',
      caption:
        'An official Zoos Victoria observation of spinifex hopping mice at Healesville Sanctuary, Victoria. Captive footage, not wild South Australian habitat. Playback is provided by YouTube.',
      credit: {
        creator: 'Zoos Victoria',
        sourceUrl: 'https://www.youtube.com/watch?v=88f9w3pzaVs',
        license:
          'Official YouTube embed only; no download or rehosting rights claimed',
      },
    },
    discovery: mouse,
    thumbnail: mouse,
    anatomy: mouse,
    poster: mouse,
    habitatNote:
      'Photographic observation by Stephen Michael Barnett. Location and wild status are not established by the source.',
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
