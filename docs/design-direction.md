# Animalia: Australia collection

## Current brief

Animalia remains a global animal encyclopaedia. The hackathon implements one country, Australia, with a South Australia focus. Species: red kangaroo (the current interpretation of "kangaroo"), spinifex hopping mouse (_Notomys alexis_), and Australian sea lion (_Neophoca cinerea_).

The supplied Animalia image defines the aesthetic: restrained white space, fine dividers, large serif animal names, quiet sans-serif details, a small left species rail and a dominant animal image. Teammate-supplied cutouts or composited wildlife images should provide the visual centre. Rectangular photographs retain their proportions and are never treated as cutouts.

## Motion

The world entrance uses a Three.js perspective camera moving through three depth layers, each containing four country photographs. GSAP maps native scroll to camera travel, revealing deeper countries while foreground planes pass the viewer. Scroll back to reverse. Projected flag/name controls track the planes. Responsive framing preserves a clear corridor around the Animalia wordmark. Reduced motion and short viewports use the static photographic composition without pinning; WebGL failure also restores it. All countries remain in the directory.

The [Beautiful Universe reference](https://www.beautifuluniverse.cc/) was inspected in a browser before implementation. Its scroll composition moves and scales imagery around a stable centre. Animalia adapts that spatial behaviour to three coherent chapters through a GSAP timeline: the outgoing image enlarges and moves away as the incoming image grows into place; text transitions accompany its own image. No third-party site code or media is used.

The desktop gallery is pinned for a finite native-scroll distance. Direct species buttons move to chapter positions. Inactive chapters are inert and hidden from assistive technology. Animation contexts are reverted on unmount and breakpoint changes. There is no continuous autoplay or wheel hijacking.

At widths below 1020px, heights below 800px, and with reduced motion enabled, chapters use normal document flow. The mobile selector is horizontal; typography uses explicit sizes rather than viewport-based font sizing.

## Navigation

World entrance -> Australia / South Australia -> species -> overview -> habitat or anatomy -> all animals. Country index includes all 250 country/territory entries, using local flag icons. Only Australia opens a collection. The logo returns to the world entrance, and hash-based navigation supports browser Back and Forward. Each animal also has a direct Explore habitat action.

The habitat view is a large 16:9 desktop or 4:3 mobile video stage. Controls stay outside the picture. Playback begins only on user action, initially muted. Without media, a calm empty state replaces playback, with the play button explicitly disabled. Anatomy uses its own still image; no overlays are placed on video.

## Ownership

Frontend owner: layout, transitions, view state, controls, responsive behaviour, accessibility, and media integration contract.

Media owner: correct species photography, habitat footage, posters, attribution/licences, optional captions, and final anatomy stills. Factual hotspot notes must link to reliable sources. Coordinates can be approved only after the still is fixed.

The latest brief replaces the side tile with a small rectangular glass overlay inside the animal photograph. White body-part dots open one sourced note on a translucent charcoal-grey surface with background blur and a fine light border. Placement prefers nearby space clear of nodes and is clamped to the image after resizing. Long notes scroll inside the tile on small screens; its heading, close control and source remain available. The introduction stays visible and the image does not resize. Escape, the close control or clicking the photograph background dismisses the tile and returns focus to the selected dot. Original models and provenance remain archived for optional reuse; the country entrance still uses Three.js.

No account system, AI service or backend is part of this implementation. The user subsequently requested public deployment; the preview is hosted on GitHub Pages through the authenticated account's fork.
