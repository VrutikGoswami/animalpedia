# Animalia assets

`countries/` contains twelve licensed landscape photographs; `flags/` contains the complete 250-entry country/territory flag set. Credits and licences are documented in `src/data/country-photos.json`, the in-app country index, and [country assets](../../docs/country-assets.md).

`models/` contains the three original GLBs, posters and unmodified provenance records from release `animal-cards-v0.1.0`. These are project illustrations, not photographs or anatomically validated scans. See [model integration](../../docs/model-integration.md). No bundled third-party renderer or Next.js application code was imported.

Use the `kangaroo/`, `spinifex-mouse/`, and `australian-sea-lion/` folders. The media teammate supplies all imagery and video for the current collection.

Set asset paths, alt text, and credits in `src/data/media.ts`. Null values produce the designed pending states. See [the media handoff](../../docs/media-handoff.md) for the exact checklist and integration example.
