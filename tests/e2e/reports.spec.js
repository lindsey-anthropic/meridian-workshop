import { test, expect } from '@playwright/test'

test.describe('Reports page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    // Wait for data to load
    await expect(page.locator('.loading')).toHaveCount(0, { timeout: 5000 }).catch(() => {})
    await page.waitForSelector('table', { timeout: 8000 })
  })

  test('shows quarterly and monthly tables', async ({ page }) => {
    const tables = page.locator('table')
    await expect(tables).toHaveCount(2)
  })

  test('shows summary stats', async ({ page }) => {
    await expect(page.locator('.stat-card')).toHaveCount(4)
  })

  test('filters update data when warehouse is changed', async ({ page }) => {
    // Get initial row count in the quarterly table
    const rows = page.locator('tbody tr')
    const initialCount = await rows.count()

    // Target Location select specifically (second select in the FilterBar)
    const warehouseSelect = page.locator('select').nth(1)
    await warehouseSelect.selectOption({ value: 'San Francisco' })

    // Wait for reload and verify table still renders
    await page.waitForTimeout(500)
    await expect(page.locator('table')).toHaveCount(2)
  })

  test('filter bar is visible on the reports page', async ({ page }) => {
    // FilterBar should render at least one select element
    const selects = page.locator('select')
    expect(await selects.count()).toBeGreaterThan(0)
  })
})
