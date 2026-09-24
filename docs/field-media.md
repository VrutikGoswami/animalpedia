# Integrated field media

The original release archives remain under ignored `.artifacts/`. Per-file source URLs, authors, licences and hashes are preserved in `src/data/field-sources.json`; displayed assets are credited through Sources & credits. Files are locally hosted, not hotlinked.

## Current selection

- Red kangaroo: Ltshears' CC BY-SA 3.0 photograph at Binder Park Zoo and Fastily's CC BY-SA 4.0 eight-second San Diego Zoo observation, sourced separately from Wikimedia Commons. Film is the 1080p VP9 transcode, with a Commons-generated poster. Both are captive observations, not South Australian wild habitat footage.
- Spinifex hopping mouse: Sardaka's CC BY-SA 4.0 photograph under red nocturnal-house lighting at Taronga Zoo, plus Dcoetzee's public-domain Sydney Wildlife World portrait for the thumbnail. Original files were copied from the release after hash verification. The red lighting is explicitly described. No reusable video was found during this pass; Habitat presents a photographic study rather than simulated wildlife footage.
- Australian sea lion: Peterdownunder's CC BY-SA 3.0 Seal Bay photograph and Matthieu VAUTRIN's CC BY 3.0 Baird Bay film. The film also includes Indo-Pacific bottlenose dolphins. The released 360p transcode was replaced with the Commons 1080p VP9 version (69,022,422 bytes, SHA-256 `1e8e2dd84608ddd54f045d2cff1783639c08b8523539dcd6f2dfb1db8d2f7f24`). Commons removed the original audio and some sections; this project made no further editorial changes. The manifest keeps the release hash separately from the new served-file hash.

No photo pixels were retouched; overview and anatomy images retain their complete aspect ratio, while small thumbnails are cropped by CSS. The downloaded red-kangaroo still is a Commons thumbnail. The applicable CC BY-SA terms remain attached to the images and the CC BY-SA kangaroo clip, not reassigned as a blanket site licence.

The release's eastern-grey-kangaroo files are excluded because they do not match the model and species entry. Sea-lion video 01 remains excluded because its source licence review is unresolved.

## Field notes and checks

Two external-feature hotspots per animal were placed after inspecting the actual photograph. Notes cite Perth Zoo, the Northern Territory Government or the Australian Museum. They are educational observations, not anatomical measurements. Changing a photograph requires rechecking every coordinate.

Playback starts paused and muted. Controls provide play/pause, sound, seeking, fullscreen where supported, and retry. Leaving Habitat unloads the video. Browser tests cover real local playback, seeking controls, mouse photographic fallback, hotspot note focus, video teardown, model rendering, navigation and responsive layout.
