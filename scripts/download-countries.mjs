import { mkdir, readFile, writeFile } from 'node:fs/promises'

const selections = [
  ['au', 'Uluru -- 2019 -- 3688', 'Dietmar Rabich', 'Uluru, Northern Territory'],
  ['nz', 'National Park 04', 'Krzysztof Golik', 'Milford Sound'],
  ['jp', 'Sakura Mount Fuji 4', 'Midori', 'Mount Fuji and Lake Kawaguchiko'],
  ['in', 'India0028', 'Diego Delso', 'Taj Mahal, Agra'],
  ['ke', 'File:Masai Mara landscape.jpg', 'Byrdyak', 'Maasai Mara'],
  ['za', '2024 -- 2825', 'Dietmar Rabich', 'Table Mountain, Cape Town'],
  ['br', 'January-2013', 'Acediscovery', 'Iguazu Falls'],
  ['ca', 'Lake-Banff NP', 'Tobias Alt (Tobi87)', 'Moraine Lake, Banff National Park'],
  ['is', '(107023745)', 'Russo Francesco', 'Kirkjufell'],
  ['no', 'Sakrisoy Reine', 'Svein Magne Tunli', 'Sakrisoy, Lofoten'],
  ['ch', '2005-06-11', 'Dirk Beyer', 'Matterhorn and Riffelsee'],
  ['cr', '(70602)', 'Rhododendrites', 'Arenal Volcano'],
]
const candidates = JSON.parse(await readFile('.artifacts/country-candidates.json', 'utf8'))
await mkdir('public/assets/countries', { recursive: true })
await mkdir('public/assets/flags', { recursive: true })
async function download(url, path) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status}: ${url}`)
  await writeFile(path, Buffer.from(await response.arrayBuffer()))
}
const photos = []
for (const [code, match, creator, place] of selections) {
  const item = candidates.find(item => item.code === code && item.title.includes(match))
  if (!item) throw new Error(`Missing candidate ${code}`)
  await download(item.image, `public/assets/countries/${code}.jpg`)
  photos.push({ code, place, src: `/assets/countries/${code}.jpg`, creator, sourceUrl: item.page, license: item.license, licenseUrl: item.licenseUrl })
  console.log(`Photograph: ${code}`)
  await new Promise(resolve => setTimeout(resolve, 1000))
}
await writeFile('src/data/country-photos.json', JSON.stringify(photos, null, 2) + '\n')
const response = await fetch('https://flagcdn.com/en/codes.json')
if (!response.ok) throw new Error('Could not fetch country directory')
const codes = await response.json()
const countries = Object.entries(codes)
  .filter(([code]) => /^[a-z]{2}$/.test(code) && !['eu', 'un'].includes(code))
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name, 'en'))
// Serial downloads keep this one-time asset import gentle on the public CDN.
for (const country of countries) {
  await download(`https://flagcdn.com/w80/${country.code}.png`, `public/assets/flags/${country.code}.png`)
}
await writeFile('src/data/countries.json', JSON.stringify(countries, null, 2) + '\n')
console.log(`Saved ${photos.length} photographs and ${countries.length} country/territory flags`)
