# Media teammate handoff

Still images and native videos need no new component work when assets arrive. Put files in the folders below and fill the corresponding entry in `src/data/media.ts`. The filenames are recommendations; the manifest is authoritative. Paths in the manifest begin with `/assets/`, never `/public/`.

## Integrated 3D models

The three self-contained GLBs from `animal-cards-v0.1.0` are integrated in the discovery stage. `src/data/models.ts` maps the existing animal IDs to `public/assets/models/`, with supplied fallback posters and source credits. Original provenance and validation files are preserved beside each GLB. These static illustrations have no rigs or movement clips and must not be treated as anatomical scans. Do not put model URLs in the existing `Still` or `Clip` slots. Country photography and flags remain independent of animal media. See [model integration](model-integration.md).

Both release ZIPs are downloaded under `.artifacts/`. The separate photo/video pack requires review: its kangaroo media depicts eastern grey kangaroos, whereas this collection and its model depict a red kangaroo. Sea-lion video 01 has a pending licence review. Neither is silently substituted or published.

## Pending assets

Three GLBs, real photographs and three sourced photo hotspots per species are live; all models also have white body-part nodes. Kangaroo and sea-lion clips play at 1080p, while mouse Habitat uses an official Zoos Victoria YouTube embed. See [field media](field-media.md). Verified wild-kangaroo footage remains a desirable replacement. Native media slots can be replaced through the manifest without changing components.

| Species / folder                            | Discovery                                   | Habitat                      | Anatomy                           |
| ------------------------------------------- | ------------------------------------------- | ---------------------------- | --------------------------------- |
| Red kangaroo / `kangaroo`                   | `discovery.webp`, optional `thumbnail.webp` | `habitat.mp4`, `poster.webp` | `anatomy.webp`, approved hotspots |
| Spinifex hopping mouse / `spinifex-mouse`   | `discovery.webp`, optional `thumbnail.webp` | `habitat.mp4`, `poster.webp` | `anatomy.webp`, approved hotspots |
| Australian sea lion / `australian-sea-lion` | `discovery.webp`, optional `thumbnail.webp` | `habitat.mp4`, `poster.webp` | `anatomy.webp`, approved hotspots |

The table lists recommended replacement filenames; actual current paths are in `src/data/media.ts`. Optional extras: English `.vtt` captions and additional verified behaviour clips. No existing panda, lion, or mantis asset is used by the new collection.

## Image preparation

- Discovery: transparent WebP/PNG for a real cutout, or an intentional photograph/composite. Set `kind` correctly. Do not bake interface text into the image. Roughly 1600-2000px on the long edge is enough for the main stage; use a visually appropriate compressed size.
- Thumbnail: optional 240px image; the discovery image is used if absent.
- Poster: preferably a frame from that same animal's supplied video, 16:9, approximately 1280-1920px wide.
- Anatomy: complete, uncropped still with body regions visible. The UI preserves the whole image. Choose the final image before setting coordinates.
- Avoid another kangaroo species under the current red kangaroo label. Spinifex hopping mice and Australian sea lions must also be correctly identified.

## Manifest example

Replace all example strings with verified values before enabling a slot:

Import `assetUrl` from `../assetUrl` and wrap local media paths as `assetUrl('/assets/...')` in TypeScript manifests so they also work on the GitHub Pages project URL. Raw paths in JSON provenance stay unchanged.

```ts
kangaroo: {
  discovery: {
    src: '/assets/kangaroo/discovery.webp',
    alt: 'Describe the actual pose and visible surroundings.',
    kind: 'cutout',
    credit: {
      creator: 'Verified creator',
      sourceUrl: 'https://original-source.example/image',
      license: 'Verified licence or permission',
      licenseUrl: 'https://license.example/terms',
    },
  },
  thumbnail: null,
  anatomy: null,
  poster: null, // Add a Still object when supplied.
  clips: [{
    id: 'habitat',
    label: 'In its habitat',
    src: '/assets/kangaroo/habitat.mp4',
    type: 'video/mp4',
    caption: 'A short description of what the actual footage shows.',
    credit: {
      creator: 'Verified filmmaker',
      sourceUrl: 'https://original-source.example/video',
      license: 'Verified permission to rehost',
    },
    // captions: '/assets/kangaroo/habitat.en.vtt',
    // start: 5,
    // end: 22,
  }],
}
```

Only the current clip is loaded. Playback is paused initially; enabling audio requires a click. Mute preference is retained when changing clips within Habitat, and resets to muted when leaving/reopening Habitat. Segment starts seek after metadata loads; the end pauses playback. Seeking is browser-dependent, not frame-perfect.

## Anatomy integration

Add three or four verified notes to the animal's `hotspots` array. Each entry needs `id`, `x`, `y`, `title`, `description`, and a `sourceId` matching one of its factual sources. Coordinates must refer to the complete chosen image. They remain percentages at every viewport size.

Do not estimate coordinates before the image exists. With no still, Anatomy shows an explicit pending state; with a still but no hotspots, it shows the photograph and pending field notes.

## Acceptance after assets arrive

Confirm species identity and licence; view every image at 1440px and 390px; inspect cutout edges and aspect ratio; play each clip; switch clips and views to confirm audio stops; check supplied captions; inspect every hotspot against its body region; test Escape and close controls; run `npm run build`, `npm run lint`, and `npm test`.

Use permitted native media or official embeds. `AnimalMedia.embed` supplies `videoId`, `title`, `caption` and `credit` for the YouTube adapter. The player is unmodified, starts without autoplay, requests muted playback and is removed on leaving Habitat. Never put a watch-page URL in a native video's `src` or download streaming footage without permission.
