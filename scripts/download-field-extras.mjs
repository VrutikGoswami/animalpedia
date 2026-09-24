import { writeFile, readFile } from 'node:fs/promises'
const sources = JSON.parse(await readFile('src/data/field-sources.json', 'utf8'))
for (const [id, title, creator, output, video] of [
  ['kangaroo-film', 'File:San Diego Zoo 2 2016-06-11.webm', 'Fastily', 'kangaroo/observation.webm', true],
  ['kangaroo-photo', 'File:Red Kangaroo 001.jpg', 'Ltshears', 'kangaroo/field.jpg', false],
]) {
  const params = new URLSearchParams({ action: 'query', titles: title, prop: 'videoinfo', viprop: 'url|derivatives|extmetadata', viurlwidth: '1600', format: 'json' })
  const response = await fetch('https://commons.wikimedia.org/w/api.php?' + params)
  const data = await response.json()
  const info = Object.values(data.query.pages)[0].videoinfo[0]
  const downloadUrl = video ? info.derivatives.find(item => item.transcodekey === '1080p.vp9.webm').src : info.thumburl
  const asset = await fetch(downloadUrl)
  if (!asset.ok) throw new Error(`Download failed: ${asset.status}`)
  await writeFile(`public/assets/${output}`, Buffer.from(await asset.arrayBuffer()))
  sources[id] = { src: `/assets/${output}`, creator, source_page: info.descriptionurl, license: info.extmetadata.LicenseShortName.value, license_url: info.extmetadata.LicenseUrl.value, download_url: downloadUrl, description: video ? 'Red kangaroo at San Diego Zoo, 2016. Captive observation, not South Australian wild habitat.' : 'Red kangaroo at Binder Park Zoo, Michigan.' }
  if (video) {
    const poster = await fetch(info.thumburl)
    if (poster.ok) await writeFile('public/assets/kangaroo/poster.jpg', Buffer.from(await poster.arrayBuffer()))
  }
  console.log(`Downloaded ${id}`)
}
await writeFile('src/data/field-sources.json', JSON.stringify(sources, null, 2) + '\n')
