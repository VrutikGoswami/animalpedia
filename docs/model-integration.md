# Released animal models

**Historical implementation:** the latest request replaces animal models with real photographs and inline side tiles. `ModelViewer.tsx` and original assets are retained for optional reuse, but are not mounted or requested by the current animal experience. The renderer description below records the former integration. Current UI coverage is in `tests/photos.spec.ts`; the original hash verifier remains available.

Source: [Original animal cards v0.1.0](https://github.com/Kylektt/animalpedia/releases/tag/animal-cards-v0.1.0), downloaded 24 September 2026. The ZIP's SHA-256 matched `f3ce2727304ee17eca497a9e07cb92c5b4b463021bb18f5c4c011c5d9e5ddb9d`.

The separate [animal media pack](https://github.com/Kylektt/animalpedia/releases/tag/media-pack-2026-09-24) supplies selected field photographs and the source for the sea-lion film; see [field media](field-media.md). Its ZIP hash matched `77a325973ef82605b68531b2da6416c704122c53d212a68d8ecc27652373a479`. Both complete archives remain in ignored `.artifacts/`; only selected assets ship with the site.

## Included files

`public/assets/models/` retains each model's GLB, PNG poster, README, asset metadata and validation record without modification:

| Folder                 | Species          | GLB size         | Triangles             |
| ---------------------- | ---------------- | ---------------- | --------------------- |
| red-kangaroo           | Osphranter rufus | 10,747,172 bytes | 106,094               |
| spinifex-hopping-mouse | Notomys alexis   | 12,670,200 bytes | See supplied metadata |
| australian-sea-lion    | Neophoca cinerea | 11,241,104 bytes | 127,274               |

Each GLB contains one mesh, embedded base-colour/normal textures, no required glTF extensions, no external asset URIs, and no animation clips. The pack describes them as original project illustrations, not anatomical scans; no additional broad redistribution licence has been assigned. Preserve that provenance instead of labelling them Creative Commons. The pack's Next.js components and bundled model-viewer runtime are not used.

## Renderer

`ModelViewer.tsx` uses Three.js GLTFLoader and OrbitControls, loaded in a separate chunk when an animal becomes active. The animal floats on the existing white, unframed stage. Camera fitting projects the complete bounds into camera space, protecting ears and tails across desktop and mobile layouts. Pixel ratio is capped at 1.5. Only one discovery model mounts at a time. Browser caching avoids unnecessary repeat transfer; each mounted scene owns its GPU resources.

Pointer dragging rotates; toolbar buttons rotate, zoom, reset and toggle automatic rotation. Scroll-wheel zoom is disabled so it does not intercept the atlas scroll. Mobile permits vertical page panning. Rotation starts paused, stops when reduced motion is switched on, and rendering is suspended offscreen or in a hidden tab. Models are static poses; turntable rotation is not animal behaviour.

Loading retains the supplied poster; failed fetches, a 25-second timeout, WebGL initialization failure and context loss show fallback/retry. Navigation, inactive chapters and modal opening dispose the renderer, controls, observers, geometry, materials and embedded textures, and abort pending fetches. Posters also fill the species rail and overview while field photography is pending.

## Body-part nodes

`src/data/model-points.ts` records three educational body-region points for each model, with glTF Y-up coordinates, outward directions, descriptions and primary source links. Release topic anchors are reused where appropriate; these are illustrations, not validated anatomy. Points snap to the mesh and project into keyboard-accessible white-dot buttons each time the camera changes. Occluded points are hidden. The Body parts toolbar button exposes every note, including currently hidden points. Opening a note pauses rotation; Escape restores focus. The small native dialog keeps notes clear of the animal rather than covering body regions with text. Photo hotspots remain a separate experience.

## Interaction checks

`node scripts/verify-models.mjs` checks GLB magic/version/length, release SHA-256 values and absence of external dependencies. `tests/models.spec.ts` checks nonblank canvas pixels, uncropped default framing, changing rendered pixels after rotation, zoom/reset, optional rotation, one-canvas ownership, navigation cleanup and failed-download retry on desktop and mobile Chromium.

The unchanged 11-13 MB models are suitable for the local prototype but need compression/LOD work before a bandwidth-sensitive production release. Specialist anatomy review, real mobile hardware and Safari/WebGL testing remain outside the current validation.
