import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('app-locale', 'en')
  })
})

test.describe('Spending (Finance) page', () => {
  test('renders the page with summary content', async ({ page }) => {
    await page.goto('/spending')

    // The Finance page has multiple chart cards and a transactions table.
    // Assert overall page identity and that core sections render.
    await expect(page.locator('main')).toBeVisible()
    await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible()

    // Currency symbol must appear (English defaults to $)
    await expect(page.locator('main').getByText('$', { exact: false }).first()).toBeVisible()
  })

  test('transactions table contains rows', async ({ page }) => {
    await page.goto('/spending')

    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    expect(await rows.count()).toBeGreaterThan(0)
  })
})
