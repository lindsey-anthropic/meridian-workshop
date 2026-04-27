import { test, expect } from '@playwright/test'

test.describe('Inventory view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await page.waitForLoadState('networkidle')
  })

  test('loads and displays inventory items', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
    const rows = page.locator('table tbody tr')
    await expect(rows).not.toHaveCount(0)
  })

  test('filter by warehouse reduces results', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()

    await page.locator('select').nth(1).selectOption('San Francisco')
    await page.waitForLoadState('networkidle')

    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeGreaterThan(0)
    expect(filteredRows).toBeLessThan(allRows)
  })

  test('filter by category reduces results', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()

    await page.locator('select').nth(2).selectOption('Sensors')
    await page.waitForLoadState('networkidle')

    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeGreaterThan(0)
    expect(filteredRows).toBeLessThan(allRows)
  })

  test('warehouse and category filters combine correctly', async ({ page }) => {
    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.locator('select').nth(2).selectOption('Sensors')
    await page.waitForLoadState('networkidle')

    const rows = page.locator('table tbody tr')
    await expect(rows).not.toHaveCount(0)
  })
})
