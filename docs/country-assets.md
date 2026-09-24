# Country entrance assets

The world scene features Australia, New Zealand, Japan, India, Kenya, South Africa, Brazil, Canada, Iceland, Norway, Switzerland and Costa Rica across three depth layers. Desktop and mobile scroll through all twelve. The static fallback uses a quieter six-photo mobile composition. The complete index is separate from this curated scene.

## Photographs

`src/data/country-photos.json` is the source of truth for local paths, pictured places, creators, Wikimedia Commons source pages and licence URLs. All twelve images were downloaded as 960px-wide Commons thumbnails. They are locally hosted JPEGs, cropped only by CSS for display; the files retain their complete downloaded image. Attribution is available in the country directory under Photography & flag credits. Preserve attribution and the applicable Creative Commons licence when replacing or adapting a photograph.

The Australian photograph shows Uluru in the **Northern Territory**. It represents Australia on the global entrance. It is not labelled or used as South Australia animal habitat footage.

## Directory and flags

Names and two-letter codes were imported from [Flagpedia / FlagCDN](https://flagpedia.net/download/api) on 24 September 2026. `src/data/countries.json` retains 250 country/territory entries, including Kosovo. US state codes, the European Union and United Nations are excluded. This is a geographic directory, not a list of 250 sovereign states or a political endorsement.

Every entry has a downloaded 80px-wide PNG flag under `public/assets/flags/`. Icons use `object-fit: contain` so national aspect ratios remain intact. The visible country name supplies the accessible label; the flag itself is decorative. No runtime country API, remote image hotlink, or emoji-font dependency is required.

Only the `au` entry is interactive. All others have explicit Coming soon labels and disabled native controls. Search supports country names and exact two-letter codes. Country photos, the central Australia action, the collection strip and the directory all reach the same `#australia` view.
