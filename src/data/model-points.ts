export interface ModelPoint {
  id: string
  title: string
  position: [number, number, number]
  normal: [number, number, number]
  description: string
  source: string
  publisher: string
}

export const modelPoints: Record<string, ModelPoint[]> = {
  kangaroo: [
    {
      id: 'muzzle',
      title: 'Muzzle',
      position: [0.46, 1.31, 0.05],
      normal: [1, 0.2, 0.5],
      description:
        "The black-and-white markings around a red kangaroo's muzzle help distinguish it from grey kangaroos. Its diet consists of grasses and other soft plants.",
      source: 'https://perthzoo.wa.gov.au/animal/red-kangaroo',
      publisher: 'Perth Zoo',
    },
    {
      id: 'hindlegs',
      title: 'Hind legs',
      position: [0.02, 0.48, 0.3],
      normal: [0, 0.2, 1],
      description:
        'Large hind limbs are adapted for hopping. During slow grazing, the two hind feet move forward together while the forelimbs and tail support the body.',
      source:
        'https://www.unsw.edu.au/newsroom/news/2014/07/kangaroos-use-tail-as-fifth-leg',
      publisher: 'UNSW',
    },
    {
      id: 'tail',
      title: 'Tail',
      position: [-0.95, 0.13, 0.04],
      normal: [0, 1, 0.6],
      description:
        "More than a counterbalance: a red kangaroo's muscular tail acts as a fifth leg during slow walking. Research found that it provides substantial propulsion as well as support.",
      source:
        'https://www.unsw.edu.au/newsroom/news/2014/07/kangaroos-use-tail-as-fifth-leg',
      publisher: 'UNSW',
    },
  ],
  'spinifex-mouse': [
    {
      id: 'eyes',
      title: 'Eyes',
      position: [0.39, 1.27, 0.205],
      normal: [0.3, 0, 0.95],
      description:
        'Large, dark eyes are a distinctive feature of this nocturnal rodent. It emerges after dark and shelters in burrows during the heat of the day.',
      source:
        'https://nt.gov.au/environment/animals/wildlife-in-nt/spinifex-hopping-mouse',
      publisher: 'Northern Territory Government',
    },
    {
      id: 'ears',
      title: 'Ears',
      position: [0.13, 1.45, 0.21],
      normal: [0.3, 0, 0.95],
      description:
        'Its oversized ears help detect predators and prey in the desert night. Together with the large eyes, they give this small nocturnal mouse its distinctive profile.',
      source:
        'https://www.reptilepark.com.au/about/meet-our-animals/spinifex-hopping-mouse',
      publisher: 'Australian Reptile Park',
    },
    {
      id: 'feet',
      title: 'Hind feet',
      position: [0.15, 0.07, 0.32],
      normal: [0.2, 0.5, 0.8],
      description:
        'Long hind legs and large feet power quick bounds. The mouse can change direction in a zig-zag while escaping predators.',
      source:
        'https://nt.gov.au/environment/animals/wildlife-in-nt/spinifex-hopping-mouse',
      publisher: 'Northern Territory Government',
    },
  ],
  'australian-sea-lion': [
    {
      id: 'snout',
      title: 'Snout & whiskers',
      position: [0.6, 0.97, 0.12],
      normal: [1, 0.4, 0.4],
      description:
        'Australian sea lions have a dog-like snout, a black nose and long whiskers. These features are visible in both sexes, despite their differences in size and coat colour.',
      source:
        'https://museum.wa.gov.au/western-adventurer/what-australian-sea-lion',
      publisher: 'Western Australian Museum',
    },
    {
      id: 'coat',
      title: 'Coat',
      position: [-0.23, 0.55, 0.24],
      normal: [0, 0.3, 1],
      description:
        'This illustration depicts an adult female. Females have silver-grey to fawn backs and pale undersides; adult males are darker with yellowish areas around the head and neck.',
      source:
        'https://australian.museum/learn/animals/mammals/australian-sea-lion/',
      publisher: 'Australian Museum',
    },
    {
      id: 'flipper',
      title: 'Front flipper',
      position: [0.04, 0.12, 0.4],
      normal: [0, 1, 1],
      description:
        'The Australian sea lion has short, narrow flippers and a stocky body. These are useful identifying features alongside its large head and sex-specific coat colours.',
      source:
        'https://australian.museum/learn/animals/mammals/australian-sea-lion/',
      publisher: 'Australian Museum',
    },
  ],
}
