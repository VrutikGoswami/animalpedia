import { expect, test } from '@playwright/test'
import { PNG } from 'pngjs'

test('all released models render, orbit, zoom and unload', async ({
  page,
}, testInfo) => {
  test.setTimeout(90000)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/#australia', { waitUntil: 'domcontentloaded' })
  for (let index = 0; index < 3; index++) {
    await page.locator('.species-link').nth(index).click()
    const chapter = page.locator('.animal-chapter').nth(index)
    await expect(chapter.locator('.model-viewer')).toHaveAttribute(
      'data-model-state',
      'ready',
      { timeout: 30000 },
    )
    const canvas = chapter.locator('canvas')
    await canvas.scrollIntoViewIfNeeded()
    const initial = await canvas.screenshot()
    const pixels = PNG.sync.read(initial)
    let colored = 0
    let minX = pixels.width,
      minY = pixels.height,
      maxX = 0,
      maxY = 0
    for (let y = 0; y < pixels.height; y++)
      for (let x = 0; x < pixels.width; x++) {
        const offset = (y * pixels.width + x) * 4
        if (
          (pixels.data[offset] +
            pixels.data[offset + 1] +
            pixels.data[offset + 2]) /
            3 <
          215
        ) {
          colored++
          minX = Math.min(minX, x)
          maxX = Math.max(maxX, x)
          minY = Math.min(minY, y)
          maxY = Math.max(maxY, y)
        }
      }
    expect(colored / (pixels.width * pixels.height)).toBeGreaterThan(0.025)
    expect(minX).toBeGreaterThan(2)
    expect(minY).toBeGreaterThan(2)
    expect(maxX).toBeLessThan(pixels.width - 2)
    expect(maxY).toBeLessThan(pixels.height - 2)
    if (index === 0) {
      const bounds = (await canvas.boundingBox())!
      await page.mouse.move(
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
      )
      await page.mouse.down()
      await page.mouse.move(
        bounds.x + bounds.width / 2 + 60,
        bounds.y + bounds.height / 2,
        { steps: 8 },
      )
      await page.mouse.up()
      expect(Buffer.compare(initial, await canvas.screenshot())).not.toBe(0)
      await chapter
        .getByRole('button', { name: 'Reset view', exact: true })
        .click()
    }
    await chapter
      .getByRole('button', { name: 'Rotate right', exact: true })
      .click()
    expect(Buffer.compare(initial, await canvas.screenshot())).not.toBe(0)
    await chapter.getByRole('button', { name: 'Zoom in', exact: true }).click()
    await chapter
      .getByRole('button', { name: 'Reset view', exact: true })
      .click()
    await chapter
      .getByRole('button', { name: 'Start rotation', exact: true })
      .click()
    const moving = await canvas.screenshot()
    await page.waitForTimeout(250)
    expect(Buffer.compare(moving, await canvas.screenshot())).not.toBe(0)
    await chapter
      .getByRole('button', { name: 'Pause rotation', exact: true })
      .click()
    await chapter
      .getByRole('button', { name: 'Reset view', exact: true })
      .click()
    await page.screenshot({ path: testInfo.outputPath(`model-${index}.png`) })
    expect(await page.locator('canvas').count()).toBe(1)
  }
  await page.locator('.wordmark').click()
  await expect(page.locator('.model-canvas canvas')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('failed model shows the supplied poster and retries', async ({ page }) => {
  let fail = true
  await page.route('**/models/red-kangaroo/model.glb', (route) =>
    fail ? route.abort() : route.continue(),
  )
  await page.goto('/#australia', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.model-viewer')).toHaveAttribute(
    'data-model-state',
    'error',
  )
  await expect(page.locator('.model-poster')).toBeVisible()
  fail = false
  await page.getByRole('button', { name: 'Retry 3D model' }).click()
  await expect(page.locator('.model-viewer')).toHaveAttribute(
    'data-model-state',
    'ready',
    { timeout: 30000 },
  )
  await expect(page.locator('.model-poster')).toHaveCount(0)
})
