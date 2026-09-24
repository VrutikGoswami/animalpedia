import { expect, test } from '@playwright/test'

test('species selection, habitat, anatomy and return journey', async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/#australia')
  for (const [index, name] of [
    'Red kangaroo',
    'Spinifex hopping mouse',
    'Australian sea lion',
  ].entries()) {
    await page.locator('.species-link').nth(index).click()
    await expect(page.locator('.species-link').nth(index)).toHaveAttribute(
      'aria-current',
      'true',
    )
    const chapter = page.locator('.animal-chapter').nth(index)
    await expect(
      chapter.getByRole('heading', { name, exact: true }),
    ).toBeVisible()
    await chapter
      .getByRole('button', { name: 'Explore habitat', exact: true })
      .click()
    const dialog = page.getByRole('dialog')
    await expect(
      dialog.getByRole('heading', { name, exact: true }),
    ).toBeVisible()
    if (index === 1) {
      await expect(dialog.getByText('Photographic observation')).toBeVisible()
      await expect(
        dialog.getByText(/Verified habitat footage is still pending/),
      ).toBeVisible()
    } else {
      await expect(
        dialog.getByRole('button', { name: 'Play video', exact: true }),
      ).toBeEnabled()
      await dialog
        .getByRole('button', { name: 'Play video', exact: true })
        .click()
      await expect
        .poll(() =>
          dialog.locator('video').evaluate((video) => video.currentTime),
        )
        .toBeGreaterThan(0)
      await expect(
        dialog.getByRole('button', { name: 'Pause video' }),
      ).toBeVisible()
      await dialog.getByRole('button', { name: 'Pause video' }).click()
      await expect(
        dialog.getByRole('slider', { name: 'Video position' }),
      ).toBeEnabled()
    }
    if (index === 0)
      await page.screenshot({ path: testInfo.outputPath('habitat.png') })
    await dialog.getByRole('button', { name: 'Anatomy', exact: true }).click()
    await expect(dialog.locator('.anatomy-image img')).toBeVisible()
    await expect(dialog.locator('.hotspot')).toHaveCount(2)
    await dialog.locator('.hotspot').first().click()
    await expect(dialog.locator('.anatomy-note h3')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog.locator('.hotspot').first()).toBeFocused()
    await expect(dialog.locator('video')).toHaveCount(0)
    if (index === 0)
      await page.screenshot({ path: testInfo.outputPath('anatomy.png') })
    await dialog.getByRole('button', { name: 'Sources & credits' }).click()
    await expect(
      dialog.getByRole('heading', { name: 'Field references' }),
    ).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(
      chapter.getByRole('button', { name: 'Explore habitat', exact: true }),
    ).toBeFocused()
  }
  expect(errors).toEqual([])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('discovery.png') })
})

test('country options, about and keyboard operation', async ({ page }) => {
  await page.goto('/#australia')
  await page.getByRole('button', { name: 'Australia', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Kenya Coming soon' }),
  ).toBeDisabled()
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('button', { name: 'Australia', exact: true }),
  ).toBeFocused()
  await page.getByRole('button', { name: 'About', exact: true }).focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('dialog', { name: 'About Animalia' }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('button', { name: 'About', exact: true }),
  ).toBeFocused()
  await page.locator('.species-link').nth(1).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.species-link').nth(1)).toHaveAttribute(
    'aria-current',
    'true',
  )
})

test('reduced motion keeps native scrolling and accessible chapters', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#australia')
  await expect(page.locator('.cinematic')).toHaveCount(0)
  await page.locator('.species-link').nth(2).click()
  await expect(page.locator('.species-link').nth(2)).toHaveAttribute(
    'aria-current',
    'true',
  )
  await expect(
    page.getByRole('heading', { name: 'Australian sea lion', exact: true }),
  ).toBeInViewport()
  expect(await page.locator('.animal-chapter[inert]').count()).toBe(0)
})

test('scroll advances the chapter and reverses', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop')
  await page.goto('/#australia')
  await expect(page.locator('#atlas-stage')).toHaveClass(/cinematic/)
  await page.mouse.wheel(0, 1300)
  await expect(page.locator('.species-link').nth(1)).toHaveAttribute(
    'aria-current',
    'true',
  )
  await page.mouse.wheel(0, 1400)
  await expect(page.locator('.species-link').nth(2)).toHaveAttribute(
    'aria-current',
    'true',
  )
  await page.mouse.wheel(0, -3000)
  await expect(page.locator('.species-link').nth(0)).toHaveAttribute(
    'aria-current',
    'true',
  )
})

test('configured broken footage has a retry path', async ({ page }) => {
  await page.route('**/missing-test.mp4', (route) => route.abort('failed'))
  await page.route('**/src/data/media.ts*', async (route) => {
    const response = await route.fetch()
    const text = await response.text()
    const extra = `\nmedia.kangaroo.clips = [{id:'test-missing',label:'Test footage',src:'/missing-test.mp4',type:'video/mp4',caption:'Test clip',credit:{creator:'Test',sourceUrl:'https://example.com',license:'Test only'}}];`
    await route.fulfill({ response, body: text + extra })
  })
  await page.goto('/#australia')
  await page
    .locator('.animal-chapter')
    .first()
    .getByRole('button', { name: 'Explore habitat' })
    .click()
  await expect(page.getByRole('alert')).toContainText(
    'This footage could not be loaded.',
    { timeout: 15000 },
  )
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('alert')).toContainText(
    'This footage could not be loaded.',
    { timeout: 15000 },
  )
  await page.getByRole('button', { name: 'Anatomy', exact: true }).click()
  await expect(page.locator('video')).toHaveCount(0)
})
