# Integrated field media

The original release archives remain under ignored `.artifacts/`. Per-file source URLs, authors, licences and hashes are preserved in `src/data/field-sources.json`; displayed assets are credited through Sources & credits. Files are locally hosted, not hotlinked.

## Current selection

- Red kangaroo: [Donald Hobern's CC BY 2.0 photograph](<https://commons.wikimedia.org/wiki/File:Macropus_rufus_(30751827488).jpg>) at Brookfield Conservation Park, Blanchetown, South Australia. The 4760 x 3570 original replaces the zoo still in Discovery, thumbnails and Anatomy. Fastily's CC BY-SA 4.0 eight-second San Diego Zoo film remains an explicitly labelled captive observation, served as the 1080p VP9 transcode.
- Spinifex hopping mouse: [Stephen Michael Barnett's CC BY 2.0 photograph](https://commons.wikimedia.org/wiki/File:Kangaroo_Mouse.jpg), 2754 x 1747, replaces the red-lit image. Commons classifies it as Notomys alexis; the source does not establish location or wild status. Both uncertainties appear in its caption and alt text. Habitat embeds [The Spinifex Hopping-mouse](https://www.youtube.com/watch?v=88f9w3pzaVs) from the official Zoos Victoria channel, published 16 December 2019. This is captive Healesville Sanctuary footage, not wild South Australia. No download, edits or rehosting; no Creative Commons claim. Do not repeat the video's erroneous description of this rodent as a marsupial.
- Australian sea lion: Peterdownunder's CC BY-SA 3.0 Seal Bay photograph and Matthieu VAUTRIN's CC BY 3.0 Baird Bay film. The film also includes Indo-Pacific bottlenose dolphins. The released 360p transcode was replaced with the Commons 1080p VP9 version (69,022,422 bytes, SHA-256 `1e8e2dd84608ddd54f045d2cff1783639c08b8523539dcd6f2dfb1db8d2f7f24`). Commons removed the original audio and some sections; this project made no further editorial changes. The manifest keeps the release hash separately from the new served-file hash.

No photo pixels were retouched; Discovery, overview and anatomy images retain their complete aspect ratio, while small thumbnails are cropped by CSS. The two new originals are hosted locally; previous stills and provenance remain available but unused. Applicable asset licences remain attached to each image and clip, not reassigned as a blanket site licence.

The release's eastern-grey-kangaroo files are excluded because they do not match the model and species entry. Sea-lion video 01 remains excluded because its source licence review is unresolved.

## Field notes and checks

Three external-feature hotspots per animal were placed after inspecting the actual photograph. Notes cite Perth Zoo, the Northern Territory Government, Animal Diversity Web, the Australian Museum and the Australian Government's marine species identification guide. They are educational observations, not anatomical measurements. Changing a photograph requires rechecking every coordinate.

Playback starts paused and muted. Native controls provide play/pause, sound, seeking, fullscreen where supported, and retry. The official mouse embed preserves YouTube controls, branding and its thumbnail; no model markers or anatomy overlays cover the player. Reload and a direct source link are outside the player. Leaving Habitat removes its iframe, stopping playback. Browser tests cover local playback, embedded-player lifecycle, hotspots, model nodes, depth layers and responsive layout. External playback depends on YouTube availability, regional restrictions and browser settings.
