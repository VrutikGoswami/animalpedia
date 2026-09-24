import { expect, test } from '@playwright/test'
import countries from '../src/data/countries.json' with { type: 'json' }

test('world entrance, country directory and Australia round trip', async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Animalia.' })).toBeVisible()
  await expect(page.locator('.country-photo')).toHaveCount(12)
  await expect
    .poll(() =>
      page
        .locator('.country-photo')
        .evaluateAll((images) =>
          images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
        ),
    )
    .toBe(true)
  await page.screenshot({ path: testInfo.outputPath('world.png') })
  await page.getByRole('button', { name: 'Countries', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'World atlas' })
  await expect(dialog.locator('.country-results > button')).toHaveCount(
    countries.length,
  )
  await expect(dialog.locator('.country-results > button:enabled')).toHaveCount(
    1,
  )
  const search = dialog.getByRole('searchbox')
  await search.fill('japan')
  await expect(
    dialog.getByRole('button', { name: 'Japan Coming soon' }),
  ).toBeDisabled()
  await search.fill('zzzzzz')
  await expect(dialog.getByText('No countries match "zzzzzz".')).toBeVisible()
  await dialog.getByRole('button', { name: 'Clear search' }).click()
  await expect(dialog.locator('.country-results > button')).toHaveCount(250)
  await search.fill('Australia')
  await page.screenshot({ path: testInfo.outputPath('directory.png') })
  await dialog
    .getByRole('button', { name: 'Australia South Australia collection' })
    .click()
  await expect(page).toHaveURL(/#australia$/)
  await expect(page.locator('.species-link')).toHaveCount(3)
  await expect(page.locator('.world-landing')).toHaveCount(0)
  await expect(page.locator('.species-link').first()).toHaveAttribute(
    'aria-current',
    'true',
  )
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Animalia.' })).toBeVisible()
  await page
    .getByRole('button', { name: 'Explore Australia', exact: true })
    .click()
  await page.locator('.wordmark').click()
  await expect(page).toHaveURL(/#world$/)
  await expect(
    page.getByRole('heading', { name: 'Animalia.' }),
  ).toBeInViewport()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  expect(errors).toEqual([])
})

test('country scene scrubs in both directions without intercepting scrolling', async ({
  page,
}, testInfo) => {
  await page.goto('/')
  const photo = page.locator('.country-au')
  const before = await photo.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  await page.mouse.wheel(0, 600)
  await expect
    .poll(() =>
      photo.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(before)
  await page.waitForTimeout(1200)
  await expect(
    page.getByRole('heading', { name: 'Animalia.' }),
  ).toBeInViewport()
  await page.screenshot({ path: testInfo.outputPath('world-scrolled.png') })
  await page.mouse.wheel(0, -2000)
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  await page
    .getByRole('button', { name: 'Australia: Explore South Australia' })
    .click()
  await expect(page.locator('.species-link')).toHaveCount(3)
})

test('reduced motion world remains static and all countries stay available', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  await page.getByRole('button', { name: 'Countries', exact: true }).click()
  await page.getByRole('searchbox').fill('nz')
  await expect(
    page.getByRole('button', { name: 'New Zealand Coming soon' }),
  ).toBeDisabled()
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('button', { name: 'Countries', exact: true }),
  ).toBeFocused()
})
