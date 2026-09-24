export interface Source {
  id: string
  title: string
  publisher: string
  url: string
  accessedAt: string
}
export interface Credit {
  creator: string
  sourceUrl: string
  license: string
  licenseUrl?: string
}
export interface Still {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
  kind: 'cutout' | 'photo' | 'illustration'
  credit: Credit
}
export interface Clip {
  id: string
  label: string
  src: string
  type: 'video/mp4' | 'video/webm'
  caption: string
  credit: Credit
  captions?: string
  start?: number
  end?: number
}
export interface AnimalMedia {
  embed?: {
    videoId: string
    title: string
    caption: string
    credit: Credit
  }
  discovery: Still | null
  thumbnail: Still | null
  anatomy: Still | null
  poster: Still | null
  clips: Clip[]
  habitatNote?: string
}
export interface Hotspot {
  id: string
  x: number
  y: number
  title: string
  description: string
  sourceId: string
}
export interface Animal {
  id: string
  commonName: string
  shortName: string
  scientificName: string
  chapter: string
  introduction: string
  habitatLabel: string
  region: string
  description: string
  media: AnimalMedia
  hotspots: Hotspot[]
  sources: Source[]
}
