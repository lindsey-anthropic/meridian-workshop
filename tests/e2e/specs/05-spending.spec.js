import { test, expect } from '@playwright/test'

/**
 * Flow 5 — Spending summary view, drilling into monthly transactions.
 * Per proposal section 3.3.
 */

test.describe('Flow 5 — Finance / Spending', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spending')
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
  })

  test('renders spending summary content', async ({ page }) => {
    const main = page.locator('main')
    // Summary view should expose totals — currency-formatted strings.
    await expect(main).toContainText(/\$[0-9]/)
  })

  test('transactions table is reachable and populated', async ({ page }) => {
    // Recent Transactions table is the default deep-content section.
    const table = page.locator('table').last()
    await expect(table.locator('tbody tr')).not.toHaveCount(0)
  })
})
