import { expect, test } from '@playwright/test'
import { PNG } from 'pngjs'

test('three country layers reveal and reverse through a nonblank scene', async ({
  page,
}, testInfo) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const field = page.locator('.country-field')
  await expect(field).toHaveClass(/depth-ready/)
  const canvas = field.locator('canvas')
  const initial = await canvas.screenshot()
  const png = PNG.sync.read(initial)
  let colored = 0
  for (let i = 0; i < png.data.length; i += 4)
    if (
      png.data[i + 3] > 50 &&
      png.data[i] + png.data[i + 1] + png.data[i + 2] < 680
    )
      colored++
  expect(colored / (png.width * png.height)).toBeGreaterThan(0.08)
  const lastCountry = page.locator('.country-cr')
  await expect(lastCountry).not.toBeVisible()
  await page.evaluate(() => scrollTo(0, innerHeight * 3.8 * 0.92))
  await expect(lastCountry).toBeVisible()
  await expect
    .poll(async () => Number(await field.getAttribute('data-camera-z')))
    .toBeLessThan(-9)
  expect(Buffer.compare(initial, await canvas.screenshot())).not.toBe(0)
  await page.screenshot({ path: testInfo.outputPath('third-layer.png') })
  await page.evaluate(() => scrollTo(0, 0))
  await expect
    .poll(async () => Number(await field.getAttribute('data-camera-z')))
    .toBe(8)
  await expect(page.locator('.country-au')).toBeVisible()
  await expect(lastCountry).not.toBeVisible()
})
