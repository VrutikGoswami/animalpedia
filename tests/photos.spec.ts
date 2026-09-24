import { expect, test } from '@playwright/test'

test('photographs open glass body-part tiles inside the image without a modal or layout shift', async ({
  page,
}, testInfo) => {
  test.setTimeout(90000)
  const errors: string[] = []
  const models: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('request', (request) => {
    if (request.url().endsWith('.glb')) models.push(request.url())
  })
  await page.goto('/#australia', { waitUntil: 'domcontentloaded' })
  for (let index = 0; index < 3; index++) {
    await page.locator('.species-link').nth(index).click()
    const chapter = page.locator('.animal-chapter').nth(index)
    const figure = chapter.locator('.encounter-figure')
    await expect(figure).toHaveAttribute('data-photo-state', 'ready')
    const nodes = chapter.locator('.photo-node')
    await expect(nodes).toHaveCount(3)
    const photo = chapter.locator('.encounter-photo')
    for (let n = 0; n < 3; n++) {
      const node = nodes.nth(n)
      await node.scrollIntoViewIfNeeded()
      await page.waitForTimeout(700)
      const before = await photo.boundingBox()
      const scrollBefore = await page.evaluate(() => scrollY)
      const bounds = (await node.boundingBox())!
      expect(bounds.x).toBeGreaterThanOrEqual(before!.x)
      expect(bounds.y).toBeGreaterThanOrEqual(before!.y)
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(
        before!.x + before!.width,
      )
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(
        before!.y + before!.height,
      )
      await node.focus()
      await page.keyboard.press('Enter')
      await expect(node).toHaveAttribute('aria-expanded', 'true')
      const tile = chapter.locator('.body-note-tile')
      await expect(tile).toBeVisible()
      await expect(tile.locator('h2')).toHaveText(
        (await node.getAttribute('aria-label'))!.replace('Inspect ', ''),
      )
      await expect(tile.locator('a')).toHaveAttribute('href', /^https:\/\//)
      await expect(page.locator('dialog[open]')).toHaveCount(0)
      await page.waitForTimeout(250)
      const after = (await photo.boundingBox())!
      const scrollAfter = await page.evaluate(() => scrollY)
      expect(after.width).toBeCloseTo(before!.width, 0)
      expect(after.height).toBeCloseTo(before!.height, 0)
      expect(after.x).toBeCloseTo(before!.x, 0)
      expect(after.y + scrollAfter).toBeCloseTo(before!.y + scrollBefore, 0)
      const tileBox = (await tile.boundingBox())!
      expect(tileBox.x).toBeGreaterThanOrEqual(after.x)
      expect(tileBox.y).toBeGreaterThanOrEqual(after.y)
      expect(tileBox.x + tileBox.width).toBeLessThanOrEqual(
        after.x + after.width,
      )
      expect(tileBox.y + tileBox.height).toBeLessThanOrEqual(
        after.y + after.height,
      )
      expect(tileBox.width).toBeLessThanOrEqual(260)
      await expect(tile).toHaveCSS('backdrop-filter', /blur/)
      await expect(chapter.locator('.encounter-introduction')).toBeVisible()
      const content = tile.locator('.body-note-content')
      await content.focus()
      await content.press('End')
      await expect
        .poll(() =>
          content.evaluate(
            (el) => el.scrollHeight - el.scrollTop - el.clientHeight,
          ),
        )
        .toBeLessThan(2)
      await page.screenshot({
        path: testInfo.outputPath(`photo-${index}-node-${n}.png`),
      })
      await page.keyboard.press('Escape')
      await expect(tile).toHaveCount(0)
      await expect(node).toBeFocused()
    }
    await nodes.last().click()
    await expect(chapter.locator('.body-note-tile')).toHaveCount(1)
    await expect(nodes.first()).toHaveAttribute('aria-expanded', 'false')
    await chapter.getByRole('button', { name: 'Close body part note' }).click()
    await expect(nodes.last()).toBeFocused()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
  expect(models).toEqual([])
  await expect(page.locator('canvas')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('failed photograph hides nodes and can be retried', async ({ page }) => {
  let fail = true
  await page.route('**/assets/kangaroo/habitat.jpg', (route) =>
    fail ? route.abort() : route.continue(),
  )
  await page.goto('/#australia', { waitUntil: 'domcontentloaded' })
  const chapter = page.locator('.animal-chapter').first()
  await expect(chapter.locator('.encounter-figure')).toHaveAttribute(
    'data-photo-state',
    'error',
  )
  await expect(chapter.locator('.photo-node')).toHaveCount(0)
  fail = false
  await chapter.getByRole('button', { name: 'Retry photograph' }).click()
  await expect(chapter.locator('.encounter-figure')).toHaveAttribute(
    'data-photo-state',
    'ready',
  )
  await expect(chapter.locator('.photo-node')).toHaveCount(3)
})

test('glass tiles stay inside photographs on short and narrow viewports', async ({
  page,
}) => {
  for (const viewport of [
    { width: 1024, height: 650 },
    { width: 320, height: 700 },
  ]) {
    await page.goto('about:blank')
    await page.setViewportSize(viewport)
    await page.goto('/#australia', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.atlas-chapters')).not.toHaveClass(/cinematic/)
    const chapter = page.locator('.animal-chapter').first()
    await expect(chapter.locator('.photo-node')).toHaveCount(3)
    await chapter.locator('.photo-node').last().click()
    await chapter.locator('.body-note-tile').scrollIntoViewIfNeeded()
    await expect(chapter.locator('.body-note-tile')).toBeInViewport()
    const tile = (await chapter.locator('.body-note-tile').boundingBox())!
    const image = (await chapter.locator('.encounter-photo').boundingBox())!
    expect(tile.x).toBeGreaterThanOrEqual(image.x)
    expect(tile.y).toBeGreaterThanOrEqual(image.y)
    expect(tile.x + tile.width).toBeLessThanOrEqual(image.x + image.width)
    expect(tile.y + tile.height).toBeLessThanOrEqual(image.y + image.height)
    const actions = (await chapter.locator('.encounter-actions').boundingBox())!
    expect(actions.y).toBeGreaterThanOrEqual(tile.y + tile.height)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }
})

test('an open glass tile repositions when the viewport changes and dismisses on the photograph', async ({
  page,
}) => {
  await page.goto('/#australia')
  const chapter = page.locator('.animal-chapter').first()
  await chapter.locator('.photo-node').first().click()
  for (const width of [320, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(750)
    const tile = (await chapter.locator('.body-note-tile').boundingBox())!
    const photo = (await chapter.locator('.encounter-photo').boundingBox())!
    expect(tile.x).toBeGreaterThanOrEqual(photo.x)
    expect(tile.y).toBeGreaterThanOrEqual(photo.y)
    expect(tile.x + tile.width).toBeLessThanOrEqual(photo.x + photo.width)
    expect(tile.y + tile.height).toBeLessThanOrEqual(photo.y + photo.height)
  }
  await chapter
    .locator('.encounter-photo > img')
    .click({ position: { x: 3, y: 3 } })
  await expect(chapter.locator('.body-note-tile')).toHaveCount(0)
})
