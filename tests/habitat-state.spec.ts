import { expect, test } from '@playwright/test'

test('clip switching, segment boundaries and anatomy round trip', async ({
  page,
}) => {
  await page.route('**/src/data/media.ts*', async (route) => {
    const response = await route.fetch()
    const body = await response.text()
    await route.fulfill({
      response,
      body:
        body +
        `
      const original = media.kangaroo.clips[0];
      media.kangaroo.clips = [
        {...original, id:'first', label:'First observation', start:0, end:2},
        {...original, id:'second', label:'Second observation', start:2, end:4}
      ];
    `,
    })
  })
  await page.goto('/#australia', { waitUntil: 'domcontentloaded' })
  await page
    .locator('.animal-chapter')
    .first()
    .getByRole('button', { name: 'Explore habitat', exact: true })
    .click()
  const video = page.locator('video')
  await expect(
    page.getByRole('button', { name: 'Play video', exact: true }),
  ).toBeEnabled()
  await page.getByRole('button', { name: 'Enable sound' }).click()
  await page.getByRole('button', { name: 'Play video', exact: true }).click()
  await page
    .getByRole('button', { name: 'Second observation', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Second observation', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('button', { name: 'Play video', exact: true }),
  ).toBeEnabled()
  await expect(video).toHaveCount(1)
  expect(await video.evaluate((v) => v.muted)).toBe(false)
  const seek = page.getByRole('slider', { name: 'Video position' })
  await expect(seek).toHaveAttribute('min', '2')
  await expect(seek).toHaveAttribute('max', '4')
  await page.getByRole('button', { name: 'Play video', exact: true }).click()
  await expect
    .poll(() => video.evaluate((v) => v.currentTime))
    .toBeGreaterThanOrEqual(4)
  await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true)
  await page.getByRole('button', { name: 'Anatomy', exact: true }).click()
  await expect(video).toHaveCount(0)
  await page
    .getByRole('button', { name: 'Return to habitat', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Second observation', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('button', { name: 'Play video', exact: true }),
  ).toBeEnabled()
  expect(await video.evaluate((v) => v.paused && v.muted)).toBe(true)
  await expect
    .poll(() => video.evaluate((v) => v.currentTime))
    .toBeCloseTo(2, 1)
  await page.keyboard.press('Escape')
  await expect(video).toHaveCount(0)
})

test('all anatomy notes are sourced and aligned within the photo', async ({
  page,
}, testInfo) => {
  await page.goto('/#australia', { waitUntil: 'domcontentloaded' })
  for (let index = 0; index < 3; index++) {
    await page.locator('.species-link').nth(index).click()
    await page
      .locator('.animal-chapter')
      .nth(index)
      .getByRole('button', { name: 'Explore habitat', exact: true })
      .click()
    await page.getByRole('button', { name: 'Anatomy', exact: true }).click()
    const points = page.locator('.hotspot')
    await expect(points).toHaveCount(3)
    for (let point = 0; point < 3; point++) {
      await points.nth(point).click()
      await expect(page.locator('.anatomy-note h3')).toBeVisible()
      await expect(page.locator('.anatomy-note a')).toHaveAttribute(
        'href',
        /^https:\/\//,
      )
      const photo = await page.locator('.anatomy-image img').boundingBox()
      const bounds = await points.nth(point).boundingBox()
      expect(bounds!.x).toBeGreaterThanOrEqual(photo!.x)
      expect(bounds!.y).toBeGreaterThanOrEqual(photo!.y)
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
        photo!.x + photo!.width,
      )
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(
        photo!.y + photo!.height,
      )
    }
    await page.screenshot({ path: testInfo.outputPath(`anatomy-${index}.png`) })
    await page.keyboard.press('Escape')
    await page.keyboard.press('Escape')
  }
})
