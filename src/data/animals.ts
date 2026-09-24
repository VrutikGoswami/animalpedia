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
        id: 'kangaroo-unsw',
        title: 'Kangaroos use tail as fifth leg',
        publisher: 'UNSW',
        url: 'https://www.unsw.edu.au/newsroom/news/2014/07/kangaroos-use-tail-as-fifth-leg',
        accessedAt: '2026-09-24',
      },
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
        id: 'muzzle',
        x: 54,
        y: 48,
        title: 'Marked muzzle',
        description:
          'Black-and-white markings around the muzzle help distinguish red kangaroos from grey kangaroos. They graze on grasses and other soft plants.',
        sourceId: 'kangaroo-zoo',
      },
      {
        id: 'hindlegs',
        x: 63,
        y: 60,
        title: 'Powerful hind legs',
        description:
          'Large hind limbs power the hop. At a slow grazing pace, both hind feet move forward together while the forelimbs and tail support the body.',
        sourceId: 'kangaroo-unsw',
      },
      {
        id: 'tail',
        x: 81,
        y: 77,
        title: 'Muscular tail',
        description:
          'More than a counterbalance: the muscular tail acts as a fifth leg during slow walking, providing propulsion as well as support.',
        sourceId: 'kangaroo-unsw',
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
        x: 64,
        y: 61,
        title: 'Dark eyes',
        description:
          'Large, dark eyes are a characteristic feature of this nocturnal desert rodent. During daylight it shelters in burrows.',
        sourceId: 'mouse-nt',
      },
      {
        id: 'ears',
        x: 56,
        y: 44,
        title: 'Upright ears',
        description:
          'The upright ears are clearly visible above the head in this photograph. In newborn spinifex hopping mice, the ears open at about 15 days old.',
        sourceId: 'mouse-adw',
      },
      {
        id: 'coat',
        x: 42,
        y: 66,
        title: 'Coat and colour',
        description:
          'Light-brown fur covers the back, contrasting with a grey-to-white underside. The foreground mouse shows this change in colour along its flank.',
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
      {
        id: 'sea-lion-identification',
        title: 'Protected marine species identification guide',
        publisher: 'Australian Government',
        url: 'https://www.dcceew.gov.au/sites/default/files/documents/protected-marine-species-identification-guide.pdf',
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
      {
        id: 'ear',
        x: 36,
        y: 44,
        title: 'External ear',
        description:
          'Australian sea lions have small external ears. One ear flap is visible just behind the closed eye of this resting animal.',
        sourceId: 'sea-lion-identification',
      },
    ],
  },
]
