# Animalia data contract

`src/types.ts` is the authoritative TypeScript contract. Shared components consume `src/data/animals.ts`; the media owner edits `src/data/media.ts`.

| Field                                       | Purpose                                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| `Animal.id`                                 | Stable chapter ID and asset folder: `kangaroo`, `spinifex-mouse`, `australian-sea-lion` |
| `commonName`, `shortName`, `scientificName` | Display title, rail label, and verified species name                                    |
| `chapter`, `introduction`, `description`    | Short editorial label, introduction and sourced overview                                |
| `habitatLabel`, `region`                    | Habitat and featured South Australian context                                           |
| `media`                                     | Discovery, thumbnail, anatomy, poster and clips                                         |
| `sources`                                   | Fact references with IDs, URLs, publishers and access dates                             |
| `hotspots`                                  | Approved image-relative coordinates, descriptions and source IDs                        |

All still slots accept `Still | null`. Null means pending. A still has `src`, `alt`, `kind: 'cutout' | 'photo' | 'illustration'`, and `credit`. Do not use another species as a placeholder. Rendered model posters use `illustration`, never `photo`.

`src/data/models.ts` is the separate 3D contract: each `AnimalModel` has `src` (self-contained GLB), `poster` (a credited Still), and `angle` (initial camera azimuth). It is keyed by the existing `Animal.id`; release folder names are mapped here rather than changing species IDs. The still/video manifest remains independent and the model poster is never used as documentary footage or an anatomy photograph.

`Clip` has an ID, label, source path, MIME type, factual caption, credit, optional WebVTT captions and optional start/end seconds. An empty `clips` array means no footage is available. Add only actual, permitted clips. A separate clip may demonstrate a specific behaviour only if the label is supported by the footage.

`Credit` records creator, original source URL, licence or stated permission, and an optional licence URL. A public URL alone does not establish rehosting permission.

`Hotspot.x` and `y` are percentages (0-100) from the top-left of the complete anatomy image. The image has natural height and its wrapper shares its bounds, so there is no separate letterbox coordinate space. Keep one hotspot note open at a time. A source ID must resolve within that animal's sources.

The prototype does not expose a backend, routes for unsupported countries, or a duplicate animal directory. Chapter links are local anchors; the content contract can grow without duplicating view components.
