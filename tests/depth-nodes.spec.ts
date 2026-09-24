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

test('body nodes stay anchored, open sourced facts and restore focus', async ({
  page,
}, testInfo) => {
  await page.goto('/#australia', { waitUntil: 'domcontentloaded' })
  for (let index = 0; index < 3; index++) {
    await page.locator('.species-link').nth(index).click()
    const chapter = page.locator('.animal-chapter').nth(index)
    await expect(chapter.locator('.model-viewer')).toHaveAttribute(
      'data-model-state',
      'ready',
      { timeout: 30000 },
    )
    const nodes = chapter.locator('.model-node:visible')
    await expect.poll(() => nodes.count()).toBeGreaterThan(0)
    const node = nodes.first()
    const before = await node.getAttribute('style')
    await chapter
      .getByRole('button', { name: 'Rotate right', exact: true })
      .click()
    await expect.poll(() => node.getAttribute('style')).not.toBe(before)
    await chapter
      .getByRole('button', { name: 'Reset view', exact: true })
      .click()
    const trigger = chapter.locator('.model-node:visible').first()
    await trigger.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: /body parts/ })
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('a')).toHaveAttribute('href', /^https:\/\//)
    await dialog.getByRole('combobox', { name: 'Body part' }).selectOption('2')
    await expect(dialog.locator('.model-part-description')).not.toBeEmpty()
    await page.screenshot({
      path: testInfo.outputPath(`body-note-${index}.png`),
    })
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await chapter
      .getByRole('button', { name: 'Body parts', exact: true })
      .click()
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Close', exact: true }).click()
  }
})
