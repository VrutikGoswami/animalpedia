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

- `/` or `/#world`: a white, full-screen country entrance inspired by the supplied Beautiful Universe reference. Twelve licensed landscape photographs expand around the central Animalia title with native, reversible scroll motion. Mobile uses a quieter six-photo composition. Reduced motion and short viewports disable pinning.
- The searchable country index includes all 250 country/territory entries in Flagpedia's two-letter directory, including Kosovo. Every entry has a locally hosted flag. Only Australia is enabled; the rest say "Coming soon". The photographed selection is not the complete directory.
- `/#australia`: the existing South Australia animal experience. The wordmark returns to the world entrance; browser Back and Forward work between these views.
- Desktop: pinned species gallery with scroll-driven scale, depth-like motion, and coordinated text transitions, inspired by [Beautiful Universe](https://www.beautifuluniverse.cc/). Original implementation; no source code or media copied.
- Visual direction: white canvas, editorial serif names, understated sage accents, fixed species index, and image-first compositions based on the supplied Animalia reference.
- Mobile, short viewports, and reduced motion: normal stacked chapters with direct species navigation. Scrolling is never intercepted with wheel handlers.
- South Australia is the featured animal region, not an assertion that the animals occur nowhere else. Australia's entrance photograph depicts Uluru in the Northern Territory; it represents the country, not the South Australia collection.
- Native dialogs support Escape, focus trapping and returning focus to the opening control.

## Media handoff

**All three released 3D illustrations, species photographs and sourced field-note hotspots are integrated.** Red-kangaroo and sea-lion videos play locally at 1080p with seeking and fullscreen. The hopping-mouse Habitat view is a credited photographic study: a reusable video is still pending. No substitute species or generated behaviour are displayed.

Country photography and all flags are already included locally under `public/assets/countries/` and `public/assets/flags/`. Per-photo creators, source pages and licences are in `src/data/country-photos.json` and the in-app country index's credits. See [country assets](docs/country-assets.md).

The [animal-cards-v0.1.0 release](https://github.com/Kylektt/animalpedia/releases/tag/animal-cards-v0.1.0) supplies red kangaroo, spinifex hopping mouse and Australian sea lion GLBs, posters and provenance. The Three.js stage supports dragging, rotate buttons, zoom, reset and optional rotation. Rotation starts paused. Only the active animal mounts a renderer; dialogs and navigation dispose it. A supplied poster remains visible during loading or errors, with a retry action. These static project illustrations are not anatomical scans or locomotion animations. See [model integration](docs/model-integration.md).

Both release archives were downloaded and SHA-256 verified under ignored `.artifacts/`. Selected mouse and sea-lion photographs are integrated with their credits. Sea-lion video 02 is upgraded to its Commons 1080p transcode and depicts Baird Bay, South Australia, including dolphins. The pack's eastern-grey-kangaroo media and sea-lion video 01 (unresolved licence review) remain excluded. A separately sourced red-kangaroo photograph and 1080p zoo clip are explicitly labelled as captive observations, not wild South Australian habitat. See [integrated field media](docs/field-media.md).

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
    ModelViewer.tsx           # Lazy Three.js viewer and resource lifecycle
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
tests/models.spec.ts          # Canvas pixels, controls, disposal and retry
```

Dependencies: React, TypeScript, Vite, GSAP + its React hook, Three.js, and Lucide icons. No backend, database or runtime AI. npm's lockfile pins installed versions. The 3D runtime is lazy-loaded only inside Australia; the build currently reports a size warning for that separate Three.js chunk. Each original GLB is approximately 11-13 MB, so compression/LOD is a future production optimization.

## Verification and limits

See [brief completion and remaining media](docs/brief-status.md) for the reconciled request checklist. Each species has three sourced anatomy points. Returning from Anatomy preserves the selected habitat clip, paused and muted; configured segments constrain seeking and pause at their end.

Browser acceptance tests cover the world entrance, loaded country photographs, full directory, search, Australia-only activation, browser history, reversible scrolling, all species, modal Escape/focus restoration, reduced motion, missing media, and injected broken-media retry at 1440px and 390px. Test screenshots and traces are written to ignored `test-results/`.

Model checks include GLB structure and hash verification (`node scripts/verify-models.mjs`), desktop/mobile canvas-pixel coverage and framing, rotation/zoom/reset, optional rotation, fallback/retry and disposal on navigation. Rendering tests use Chromium/Edge; physical low-end devices and Safari still need release testing.

The kangaroo is a red kangaroo; do not substitute the archive's eastern-grey media. Field-note points identify visible external features in the actual photographs, not scientific anatomical segmentation. Wild red-kangaroo habitat footage and a reusable hopping-mouse film remain desirable replacements. Google Fonts is optional; local serif and sans-serif fallbacks keep the interface usable offline. The HD sea-lion film is about 69 MB; production should add adaptive delivery.

See [design direction](docs/design-direction.md), [data contract](docs/data-contract.md), and [contribution guide](CONTRIBUTING.md). Existing GitHub issues describing the old 10-animal directory are superseded by this brief; they have not been edited remotely.
