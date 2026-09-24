import type { Animal } from '../types'
import { media } from './media'

export const animals: Animal[] = [
  {
    id: 'kangaroo',
    commonName: 'Red kangaroo',
    shortName: 'Kangaroo',
    scientificName: 'Osphranter rufus',
    chapter: 'Across the open country',
    introduction: 'Life on the wide, open plains.',
    habitatLabel: 'Arid grasslands',
    region: 'South Australian outback',
    description:
      'An animal of inland Australia, at home in open country. Our first chapter begins in the arid landscapes of South Australia.',
    media: media.kangaroo,
    sources: [
      {
        id: 'kangaroo-zoo',
        title: 'Red kangaroo: identification and diet',
        publisher: 'Perth Zoo',
        url: 'https://perthzoo.wa.gov.au/animal/red-kangaroo',
        accessedAt: '2026-09-24',
      },
      {
        id: 'kangaroo-ala',
        title: 'Red kangaroo',
        publisher: 'Atlas of Living Australia',
        url: 'https://bie.ala.org.au/species/https%3A/biodiversity.org.au/afd/taxa/7e6e134b-2bc7-43c4-b23a-6e3f420f57ad',
        accessedAt: '2026-09-24',
      },
    ],
    hotspots: [
      {
        id: 'coat',
        x: 53,
        y: 22,
        title: 'Reddish coat',
        description:
          'Red kangaroos have a reddish-brown coat with a pale belly. This photograph shows an animal grazing in a zoo enclosure.',
        sourceId: 'kangaroo-zoo',
      },
      {
        id: 'tail',
        x: 81,
        y: 60,
        title: 'Muscular tail',
        description:
          'A long, strong tail is a characteristic feature of the red kangaroo.',
        sourceId: 'kangaroo-zoo',
      },
    ],
  },
  {
    id: 'spinifex-mouse',
    commonName: 'Spinifex hopping mouse',
    shortName: 'Spinifex mouse',
    scientificName: 'Notomys alexis',
    chapter: 'After the desert falls quiet',
    introduction: 'A small life in a vast landscape.',
    habitatLabel: 'Spinifex sandplains',
    region: 'Arid South Australia',
    description:
      'A native desert rodent with long hind feet and a tufted tail. Spinifex-covered sand country offers shelter for this nocturnal animal.',
    media: media['spinifex-mouse'],
    sources: [
      {
        id: 'mouse-nt',
        title: 'Spinifex hopping mouse',
        publisher: 'Northern Territory Government',
        url: 'https://nt.gov.au/environment/animals/wildlife-in-nt/spinifex-hopping-mouse',
        accessedAt: '2026-09-24',
      },
      {
        id: 'mouse-adw',
        title: 'Notomys alexis',
        publisher: 'Animal Diversity Web, University of Michigan',
        url: 'https://animaldiversity.org/accounts/Notomys_alexis/',
        accessedAt: '2026-09-24',
      },
    ],
    hotspots: [
      {
        id: 'eyes',
        x: 44,
        y: 60,
        title: 'Dark eyes',
        description:
          'Large, dark eyes are a characteristic feature of this nocturnal desert rodent. During daylight it shelters in burrows.',
        sourceId: 'mouse-nt',
      },
      {
        id: 'coat',
        x: 69,
        y: 45,
        title: 'Coat and colour',
        description:
          'The natural coat is light brown with a grey-to-white underside. The red colour in this photograph comes from nocturnal-house lighting.',
        sourceId: 'mouse-nt',
      },
    ],
  },
  {
    id: 'australian-sea-lion',
    commonName: 'Australian sea lion',
    shortName: 'Australian sea lion',
    scientificName: 'Neophoca cinerea',
    chapter: 'Where the land meets the sea',
    introduction: 'Between the shore and the Southern Ocean.',
    habitatLabel: 'Coastal waters and islands',
    region: 'South Australian coast',
    description:
      'Found along the southern and western coasts of Australia, these sea lions return to land to rest and breed. Seal Bay on Kangaroo Island is one of their coastal colonies.',
    media: media['australian-sea-lion'],
    sources: [
      {
        id: 'sea-lion-museum',
        title: 'Australian sea lion',
        publisher: 'Australian Museum',
        url: 'https://australian.museum/learn/animals/mammals/australian-sea-lion/',
        accessedAt: '2026-09-24',
      },
    ],
    hotspots: [
      {
        id: 'coat',
        x: 61,
        y: 28,
        title: 'Coat',
        description:
          'Female Australian sea lions have silver-grey to fawn backs and pale undersides. Adult males have darker coats with yellowish areas around the head and neck.',
        sourceId: 'sea-lion-museum',
      },
      {
        id: 'flippers',
        x: 84,
        y: 60,
        title: 'Front flipper',
        description:
          'Australian sea lions have stocky bodies and short, narrow flippers. This resting animal was photographed at Seal Bay on Kangaroo Island.',
        sourceId: 'sea-lion-museum',
      },
    ],
  },
]
