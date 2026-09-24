import type { Still } from '../types'
import { assetUrl } from '../assetUrl'

export interface AnimalModel {
  src: string
  poster: Still
  angle: number
}
const release =
  'https://github.com/Kylektt/animalpedia/releases/tag/animal-cards-v0.1.0'
function model(folder: string, name: string, angle: number): AnimalModel {
  return {
    src: assetUrl(`/assets/models/${folder}/model.glb`),
    angle,
    poster: {
      src: assetUrl(`/assets/models/${folder}/poster.png`),
      alt: `${name}, original Animalpedia 3D illustration, not an anatomical scan`,
      kind: 'illustration',
      credit: {
        creator: 'Animalpedia project',
        sourceUrl: release,
        license:
          'Project-created illustration; no additional broad licence assigned',
      },
    },
  }
}
export const models: Record<string, AnimalModel> = {
  kangaroo: model('red-kangaroo', 'Red kangaroo', 48),
  'spinifex-mouse': model(
    'spinifex-hopping-mouse',
    'Spinifex hopping mouse',
    42,
  ),
  'australian-sea-lion': model(
    'australian-sea-lion',
    'Australian sea lion',
    45,
  ),
}
