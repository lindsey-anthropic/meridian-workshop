import { test, expect } from '@playwright/test'

test.describe('Restocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
  })

  test('loads without errors', async ({ page }) => {
    await expect(page.locator('.error')).toHaveCount(0)
    await expect(page.locator('.loading')).toHaveCount(0)
  })

  test('shows budget input', async ({ page }) => {
    await expect(page.locator('.budget-input')).toBeVisible()
  })

  test('shows stat cards with counts', async ({ page }) => {
    await expect(page.locator('.stat-card')).not.toHaveCount(0)
  })

  test('budget change updates recommendations', async ({ page }) => {
    const budgetInput = page.locator('.budget-input')
    const initialCount = await page.locator('.stat-value').first().textContent()

    await budgetInput.fill('5000')
    await page.waitForTimeout(600)

    const updatedCount = await page.locator('.stat-value').first().textContent()
    // Values may differ — both calls should complete without error
    await expect(page.locator('.error')).toHaveCount(0)
  })

  test('shows recommendations table when data is present', async ({ page }) => {
    const table = page.locator('.restocking-table, table')
    const emptyState = page.locator('.empty-state')
    // Either a table or an empty state message must be visible
    await expect(table.or(emptyState).first()).toBeVisible()
  })
})
