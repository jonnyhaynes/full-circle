import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/**
 * Put the page into its settled state before an audit: no animation running, and
 * everything that reveals on scroll shown. Without this a scan can catch the
 * hero button mid fade-in, or a card mid rise, while it is still translucent —
 * and report a contrast failure that does not exist on the settled page. (The
 * reveals are shown the same way the no-JS fallback shows them.)
 */
async function settleForAudit(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after { animation: none !important; transition: none !important; }
      [data-reveal] { opacity: 1 !important; transform: none !important; visibility: visible !important; }
    `,
  })
}

const routes = [
  '/',
  '/about-us',
  '/services',
  '/services/live-music',
  '/gallery',
  '/contact-us',
  '/privacy-policy',
]

for (const route of routes) {
  test(`no accessibility violations on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' })
    await settleForAudit(page)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
}

/**
 * Open the mobile menu, if it is not already open. A dev-server recompile can
 * remount the header mid-test and close it, which would otherwise leave the
 * following click targeting a button that no longer exists.
 */
async function ensureMenuOpen(page: Page) {
  const open = page.getByRole('button', { name: 'Open menu' })
  if (await open.isVisible().catch(() => false)) {
    await open.click()
  }
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
}

test('mobile menu opens, has no violations, and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/about-us', { waitUntil: 'networkidle' })
  await settleForAudit(page)

  await ensureMenuOpen(page)
  await settleForAudit(page)

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])

  // Closing by button also proves the open panel doesn't cover the control.
  await ensureMenuOpen(page)
  await page.getByRole('button', { name: 'Close menu' }).click()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()

  // And it closes with the keyboard.
  await ensureMenuOpen(page)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
})
