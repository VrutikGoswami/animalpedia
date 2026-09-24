# Animalia: Australia collection

## Current brief

Animalia remains a global animal encyclopaedia. The hackathon implements one country, Australia, with a South Australia focus. Species: red kangaroo (the current interpretation of "kangaroo"), spinifex hopping mouse (_Notomys alexis_), and Australian sea lion (_Neophoca cinerea_).

The supplied Animalia image defines the aesthetic: restrained white space, fine dividers, large serif animal names, quiet sans-serif details, a small left species rail and a dominant animal image. Teammate-supplied cutouts or composited wildlife images should provide the visual centre. Rectangular photographs retain their proportions and are never treated as cutouts.

## Motion

The first screen is now the world entrance: a central Animalia wordmark surrounded by twelve landscape photographs with flag labels. A finite, scroll-scrubbed GSAP timeline expands the photographic field outward at differing distances while the title gently recedes. The composition uses CSS transforms, not a 3D renderer. Mobile shows six photographs; every country remains in the searchable index. Reduced motion removes the animation and pinning. Country photographs are real, locally hosted, licensed images with in-app credits.

The [Beautiful Universe reference](https://www.beautifuluniverse.cc/) was inspected in a browser before implementation. Its scroll composition moves and scales imagery around a stable centre. Animalia adapts that spatial behaviour to three coherent chapters through a GSAP timeline: the outgoing image enlarges and moves away as the incoming image grows into place; text transitions accompany its own image. No third-party site code or media is used.

The desktop gallery is pinned for a finite native-scroll distance. Direct species buttons move to chapter positions. Inactive chapters are inert and hidden from assistive technology. Animation contexts are reverted on unmount and breakpoint changes. There is no continuous autoplay or wheel hijacking.

At widths below 1020px, heights below 650px, and with reduced motion enabled, chapters use normal document flow. The mobile selector is horizontal; typography uses explicit sizes rather than viewport-based font sizing.

## Navigation

World entrance -> Australia / South Australia -> species -> overview -> habitat or anatomy -> all animals. Country index includes all 250 country/territory entries, using local flag icons. Only Australia opens a collection. The logo returns to the world entrance, and hash-based navigation supports browser Back and Forward. Each animal also has a direct Explore habitat action.

The habitat view is a large 16:9 desktop or 4:3 mobile video stage. Controls stay outside the picture. Playback begins only on user action, initially muted. Without media, a calm empty state replaces playback, with the play button explicitly disabled. Anatomy uses its own still image; no overlays are placed on video.

## Ownership

Frontend owner: layout, transitions, view state, controls, responsive behaviour, accessibility, and media integration contract.

Media owner: correct species photography, habitat footage, posters, attribution/licences, optional captions, and final anatomy stills. Factual hotspot notes must link to reliable sources. Coordinates can be approved only after the still is fixed.

The released original animal models now render through a lazy-loaded Three.js viewer on the unframed discovery stage. Only the active animal has a canvas; closing the collection or opening a dialog disposes its renderer, geometry, materials and textures. Drag and icon controls handle inspection, while optional rotation starts paused and stops when reduced motion is enabled. Original posters provide loading/error fallbacks and species thumbnails. These are static illustrations, not scientific anatomical models. See model-integration.md for provenance and verification.

No account system, AI service, backend or deployment is part of this implementation.
