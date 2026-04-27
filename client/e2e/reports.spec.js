import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
  })

  test('loads without errors', async ({ page }) => {
    await expect(page.locator('.error')).toHaveCount(0)
    await expect(page.locator('.loading')).toHaveCount(0)
  })

  test('shows quarterly performance table', async ({ page }) => {
    await expect(page.locator('.reports-table, table').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /quarterly performance/i })).toBeVisible()
  })

  test('quarterly table has data rows', async ({ page }) => {
    const rows = page.locator('.reports-table tbody tr, table tbody tr')
    await expect(rows).not.toHaveCount(0)
  })

  test('shows monthly revenue trend section', async ({ page }) => {
    await expect(page.getByText(/monthly revenue trend/i)).toBeVisible()
  })
})
