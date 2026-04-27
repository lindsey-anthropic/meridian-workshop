import { test, expect } from '@playwright/test'

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
  })

  test('loads and shows inventory table', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('tbody tr').first()).toBeVisible()
  })

  test('filter bar is visible', async ({ page }) => {
    await expect(page.locator('.filter-bar, .filters, select').first()).toBeVisible()
  })

  test('does not show an error state on load', async ({ page }) => {
    await expect(page.locator('.error')).toHaveCount(0)
  })
})
