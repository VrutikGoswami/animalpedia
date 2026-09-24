import { mkdir, writeFile } from 'node:fs/promises'

const terms = [
  ['au', 'Uluru landscape'], ['nz', 'Milford Sound landscape'],
  ['jp', 'Mount Fuji lake'], ['in', 'Taj Mahal reflection'],
  ['ke', 'Masai Mara landscape'], ['za', 'Table Mountain Cape Town'],
  ['br', 'Iguazu falls Brazil'], ['ca', 'Moraine Lake Canada'],
  ['is', 'Kirkjufell landscape'], ['no', 'Lofoten Reine landscape'],
  ['ch', 'Matterhorn lake'], ['cr', 'Arenal volcano Costa Rica'],
]
await mkdir('.artifacts', { recursive: true })
const results = []
for (const [code, term] of terms) {
  const params = new URLSearchParams({ action: 'query', generator: 'search', gsrsearch: term + ' filetype:bitmap', gsrnamespace: '6', gsrlimit: '3', prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '960', format: 'json' })
  const response = await fetch('https://commons.wikimedia.org/w/api.php?' + params, { headers: { 'User-Agent': 'AnimaliaPrototype/1.0 (country image attribution research)' } })
  if (!response.ok) { console.log(code, response.status); continue }
  const data = await response.json()
  for (const page of Object.values(data.query?.pages ?? {})) {
    const ii = page.imageinfo?.[0]
    if (!ii) continue
    results.push({ code, title: page.title, image: ii.thumburl, page: ii.descriptionurl, width: ii.width, height: ii.height, creator: ii.extmetadata.Artist?.value, license: ii.extmetadata.LicenseShortName?.value, licenseUrl: ii.extmetadata.LicenseUrl?.value })
  }
  await new Promise(resolve => setTimeout(resolve, 1200))
}
await writeFile('.artifacts/country-candidates.json', JSON.stringify(results, null, 2))
console.log(results.map(item => ({code:item.code,title:item.title,license:item.license,width:item.width,height:item.height})))
