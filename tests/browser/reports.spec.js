import { test, expect } from '@playwright/test'

test.describe('Reports page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForLoadState('networkidle')
  })

  test('quarterly table renders with data', async ({ page }) => {
    const rows = page.locator('table').first().locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('monthly trends table renders with data', async ({ page }) => {
    const tables = page.locator('table')
    const lastTable = tables.last()
    const rows = lastTable.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('summary stat cards show non-empty values', async ({ page }) => {
    const statValues = page.locator('.stat-value')
    const count = await statValues.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const text = await statValues.nth(i).textContent()
      expect(text.trim()).not.toBe('')
    }
  })

  test('warehouse filter updates quarterly data', async ({ page }) => {
    const firstTable = page.locator('table').first()
    const firstCellBefore = await firstTable.locator('tbody tr').first().locator('td').nth(1).textContent()

    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.waitForLoadState('networkidle')

    const firstCellAfter = await firstTable.locator('tbody tr').first().locator('td').nth(1).textContent()
    expect(firstCellAfter).not.toBe(firstCellBefore)
  })

  test('bar chart renders', async ({ page }) => {
    const bars = page.locator('.bar')
    const count = await bars.count()
    expect(count).toBeGreaterThan(0)
  })
})
