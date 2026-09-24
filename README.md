# Animalia

A global wildlife atlas, beginning with **South Australia**. The entrance surrounds a central Animalia wordmark with country photography and flags. Scroll through the image field, browse the world index, or enter Australia for three encounters: the red kangaroo, spinifex hopping mouse, and Australian sea lion.

## Run locally

Use Node.js 22.12+ (verified with Node 24) and npm.

```sh
npm ci
npm run dev
```

Vite prints the local URL. The development preview for this workspace is running at http://127.0.0.1:5173.

## Public preview

GitHub Pages: https://vrutikgoswami.github.io/animalpedia/

The preview is published from the `gh-pages` branch of the public [deployment fork](https://github.com/VrutikGoswami/animalpedia). Kyle's original repository is unchanged. Build for this project URL with `npm run build -- --base=/animalpedia/`; publish the contents of `dist/` to `gh-pages`. The default build still supports hosting at a domain root. Media paths use Vite's base URL for both deployments.

```sh
npm run build       # TypeScript checks and production output in dist/
npm run preview     # Serve the production build locally
npm run lint
npm test            # Desktop and mobile browser tests
```

Browser tests use Microsoft Edge by default. On a machine without Edge, run `npx playwright install chromium` and set `BROWSER_CHANNEL=chromium` before `npm test`.

## Experience

- `/` or `/#world`: a white, full-screen Three.js country entrance. The camera travels through three depth layers of four licensed country photographs, revealing the next countries as the front layer passes out of view. Reverse scroll travels back out. Mobile keeps the title clear; reduced motion, short viewports and WebGL failures retain a static photographic layout.
- The searchable country index includes all 250 country/territory entries in Flagpedia's two-letter directory, including Kosovo. Every entry has a locally hosted flag. Only Australia is enabled; the rest say "Coming soon". The photographed selection is not the complete directory.
- `/#australia`: the existing South Australia animal experience. The wordmark returns to the world entrance; browser Back and Forward work between these views.
- Desktop: pinned species gallery with scroll-driven scale, depth-like motion, and coordinated text transitions, inspired by [Beautiful Universe](https://www.beautifuluniverse.cc/). Original implementation; no source code or media copied.
- Visual direction: white canvas, editorial serif names, understated sage accents, fixed species index, and image-first compositions based on the supplied Animalia reference.
- Mobile, short viewports, and reduced motion: normal stacked chapters with direct species navigation. Scrolling is never intercepted with wheel handlers.
- South Australia is the featured animal region, not an assertion that the animals occur nowhere else. Australia's entrance photograph depicts Uluru in the Northern Territory; it represents the country, not the South Australia collection.
- Native dialogs support Escape, focus trapping and returning focus to the opening control.

## Media handoff

**The animal stage uses real photographs with white body-part nodes.** Each node opens a small rectangular, grey-tinted glass tile inside the photograph on desktop and mobile. Placement adapts to image bounds and nearby nodes. The introduction stays visible, while long notes scroll within the tile on small screens. Close, Escape or the photograph background dismiss it and restore node focus; image failures hide nodes and offer retry. The country entrance keeps its 3D depth animation. Red-kangaroo and sea-lion videos play locally at 1080p; mouse Habitat retains the official Zoos Victoria YouTube embed.

Country photography and all flags are already included locally under `public/assets/countries/` and `public/assets/flags/`. Per-photo creators, source pages and licences are in `src/data/country-photos.json` and the in-app country index's credits. See [country assets](docs/country-assets.md).

The [animal-cards-v0.1.0 release](https://github.com/Kylektt/animalpedia/releases/tag/animal-cards-v0.1.0) GLBs, posters, provenance and original viewer remain in the repository for optional future reuse. They are no longer mounted or downloaded by the animal experience. These static project illustrations are not anatomical scans. See [model integration](docs/model-integration.md) for the historical implementation.

Both release archives were downloaded and SHA-256 verified under ignored `.artifacts/`. The new kangaroo photograph shows Brookfield Conservation Park, South Australia (Donald Hobern, CC BY 2.0). The mouse photograph shows naturally coloured hopping mice among leaf litter (Stephen Michael Barnett, CC BY 2.0); the source does not establish location or wild status, and the caption explicitly says so. The sea lion rests on the beach at Seal Bay. All photo coordinates are matched to these complete, uncropped images. Sea-lion video 02 is the Commons 1080p transcode from Baird Bay, including dolphins. The red-kangaroo video remains an explicitly labelled zoo observation. The pack's eastern-grey media and unreviewed sea-lion video 01 remain excluded. See [integrated field media](docs/field-media.md).

1. Put approved files under `public/assets/kangaroo/`, `spinifex-mouse/`, or `australian-sea-lion/`.
2. Populate [`src/data/media.ts`](src/data/media.ts) with paths, useful alt text, creator, source and licence.
3. Update sourced field-note hotspots in [`src/data/animals.ts`](src/data/animals.ts) whenever their underlying photographs change.
4. Rehearse each animal on desktop and mobile.

See the [exact asset checklist and examples](docs/media-handoff.md). Missing slots show deliberate empty states. Video controls become available when clips are configured. The player supports MP4/WebM, posters, captions, mute, retry, and optional segments; only the selected clip mounts. Leaving Habitat stops and unloads it. Reopening Habitat starts paused and muted.

## Project structure

```text
src/
  App.tsx                     # World / Australia navigation and dialogs
  landing.css                 # Country scene and directory styles
  styles.css                  # Responsive visual system
  types.ts                    # Shared content and asset contracts
  data/animals.ts             # Species, regions, factual sources, hotspots
  data/media.ts               # Teammate's media manifest
  data/field-sources.json     # Imported file provenance and download records
  data/models.ts              # Released GLBs, posters and attribution
  data/countries.json         # Complete country/territory names and codes
  data/country-photos.json    # Featured photography and attribution
  components/
    DiscoverScreen.tsx        # Scroll gallery and species index
    AnimalEncounter.tsx       # Habitat photograph, nodes and glass detail overlay
    ModelViewer.tsx           # Retained optional viewer; not mounted
    CountryLanding.tsx        # Scroll-driven world entrance
    CountryDirectory.tsx      # Search, country flags and credits
    Header.tsx                # World / collection navigation
    AnimalDialog.tsx          # Overview / Habitat / Anatomy
    HabitatPlayer.tsx         # Video lifecycle and error recovery
    Anatomy.tsx               # Image-relative hotspots
    AnimalImage.tsx           # Photograph / cutout / empty state
    Modal.tsx                 # Accessible native dialog
tests/journey.spec.ts         # Browser acceptance checks
tests/world.spec.ts           # Country entrance and navigation checks
tests/photos.spec.ts          # Glass tile bounds, focus, resizing and photo retry
```

Dependencies: React, TypeScript, Vite, GSAP + its React hook, Three.js, and Lucide icons. No backend, database or runtime AI. npm's lockfile pins installed versions. Three.js is lazy-loaded for the country scene; its chunk still produces a size warning. Original GLBs are retained as static files but are not requested during the photo experience.

## Verification and limits

See [brief completion and remaining media](docs/brief-status.md) for the reconciled request checklist. Each species has three sourced anatomy points. Returning from Anatomy preserves the selected habitat clip, paused and muted; configured segments constrain seeking and pause at their end.

Browser acceptance tests cover the world entrance, loaded country photographs, full directory, search, Australia-only activation, browser history, reversible scrolling, all species, modal Escape/focus restoration, reduced motion, missing media, and injected broken-media retry at 1440px and 390px. Test screenshots and traces are written to ignored `test-results/`.

Photo checks cover all nine nodes, glass tiles contained inside the image, stable photo bounds, resizing with an open note, scrollable information, no open modal or GLB downloads, keyboard selection, dismissal/focus restoration, failed-image retry, and narrow/short layouts. Country canvas-pixel and reversible-depth tests remain. Original model integrity can still be checked with `node scripts/verify-models.mjs`. Rendering tests use Chromium/Edge; physical low-end devices and Safari still need release testing.

The kangaroo is a red kangaroo; do not substitute the archive's eastern-grey media. Photo and model points are educational body-region notes, not scientific anatomical segmentation. Wild red-kangaroo footage remains desirable. Mouse playback requires YouTube access; a direct Watch on YouTube link and reload control remain available. Google Fonts is optional; local serif and sans-serif fallbacks keep the interface usable offline. The HD sea-lion film is about 69 MB; production should add adaptive delivery.

See [design direction](docs/design-direction.md), [data contract](docs/data-contract.md), and [contribution guide](CONTRIBUTING.md). Existing GitHub issues describing the old 10-animal directory are superseded by this brief; they have not been edited remotely.
