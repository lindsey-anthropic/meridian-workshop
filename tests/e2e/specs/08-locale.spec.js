import { test, expect } from '@playwright/test'

/**
 * Flow 10 — Locale switching: verify Tokyo-locale strings render across views (D2).
 * Per proposal section 3.3.
 *
 * The LanguageSwitcher persists locale to localStorage. We reset before each test
 * by clearing storage on first navigation.
 */

test.describe('Flow 10 — Locale switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('app-locale'))
    await page.reload()
  })

  test('switching to Japanese localizes nav strings', async ({ page }) => {
    // Default English nav should be visible.
    await expect(page.getByRole('link', { name: 'Restocking' })).toBeVisible()

    // Open language switcher and pick Japanese.
    await page.locator('button', { hasText: 'English' }).click()
    await page.getByRole('button', { name: /日本語/ }).click()

    // Nav should localize.
    await expect(page.getByRole('link', { name: '補充' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'レポート' })).toBeVisible()
  })

  test('Restocking view localizes title and currency in JP locale', async ({ page }) => {
    await page.locator('button', { hasText: 'English' }).click()
    await page.getByRole('button', { name: /日本語/ }).click()

    await page.goto('/restocking')
    await expect(page.getByRole('heading', { name: '補充推奨' }).first()).toBeVisible()
    // Currency renders as ¥ in JP locale.
    const main = page.locator('main')
    await expect(main).toContainText('¥')
  })

  test('Reports view localizes after R1 i18n integration (D2)', async ({ page }) => {
    await page.locator('button', { hasText: 'English' }).click()
    await page.getByRole('button', { name: /日本語/ }).click()

    await page.goto('/reports')
    await expect(page.getByRole('heading', { name: '業績レポート' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '四半期業績' })).toBeVisible()
  })
})
