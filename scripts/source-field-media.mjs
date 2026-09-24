import { readFile, writeFile, copyFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const imported = {}
for (const [id, folder, file, output] of [
  ['mouse', 'spinifex_hopping_mouse', 'images/01_spinifex_hopping_mouse.jpg', 'spinifex-mouse/field.jpg'],
  ['mouse-natural', 'spinifex_hopping_mouse', 'images/04_spinifex_hopping_mouse.jpg', 'spinifex-mouse/portrait.jpg'],
  ['sea-lion', 'australian_sea_lion', 'images/08_australian_sea_lion.jpg', 'australian-sea-lion/field.jpg'],
  ['sea-lion-habitat', 'australian_sea_lion', 'images/05_australian_sea_lion.jpg', 'australian-sea-lion/habitat.jpg'],
  ['sea-lion-film', 'australian_sea_lion', 'videos/02_australian_sea_lion.webm', 'australian-sea-lion/habitat.webm'],
]) {
  const directory = `.artifacts/field-media/${folder}`
  const records = JSON.parse(await readFile(`${directory}/sources.json`, 'utf8')).records
  const source = records.find(item => item.file === file)
  const bytes = await readFile(`${directory}/${file}`)
  if (createHash('sha256').update(bytes).digest('hex') !== source.sha256) throw new Error(`Checksum mismatch: ${file}`)
  await copyFile(`${directory}/${file}`, `public/assets/${output}`)
  imported[id] = { src: `/assets/${output}`, ...source }
}
await writeFile('src/data/field-sources.json', JSON.stringify(imported, null, 2) + '\n')

const titles = ['File:San Diego Zoo 2 2016-06-11.webm', 'File:Rotes Riesenkänguru (Zoo Dresden) (24).webm', 'File:Red Kangaroo 001.jpg']
for (const title of titles) {
  const params = new URLSearchParams({ action: 'query', titles: title, prop: 'videoinfo', viprop: 'url|derivatives|extmetadata', viurlwidth: '1600', format: 'json' })
  const response = await fetch('https://commons.wikimedia.org/w/api.php?' + params)
  const data = await response.json()
  for (const page of Object.values(data.query?.pages ?? {})) console.log(JSON.stringify({ title, info: page.videoinfo }))
}
