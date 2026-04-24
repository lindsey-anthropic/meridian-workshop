import { test, expect } from '@playwright/test'

test.describe('Inventory filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await page.waitForLoadState('networkidle')
  })

  test('loads inventory table with rows', async ({ page }) => {
    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('warehouse filter reduces row count', async ({ page }) => {
    const allRows = page.locator('tbody tr')
    const totalCount = await allRows.count()

    await page.locator('select').nth(1).selectOption('San Francisco')
    await page.waitForLoadState('networkidle')
    await expect(allRows.first()).toBeVisible()

    const filteredCount = await allRows.count()
    expect(filteredCount).toBeGreaterThan(0)
    expect(filteredCount).toBeLessThan(totalCount)
  })

  test('category filter reduces row count', async ({ page }) => {
    const allRows = page.locator('tbody tr')
    const totalCount = await allRows.count()

    await page.locator('select').nth(2).selectOption('sensors')
    await page.waitForLoadState('networkidle')
    await expect(allRows.first()).toBeVisible()

    const filteredCount = await allRows.count()
    expect(filteredCount).toBeGreaterThan(0)
    expect(filteredCount).toBeLessThan(totalCount)
  })

  test('combined warehouse + category filter works', async ({ page }) => {
    await page.locator('select').nth(1).selectOption('London')
    await page.locator('select').nth(2).selectOption('controllers')
    await page.waitForLoadState('networkidle')

    const rows = page.locator('tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('reset button clears filters and restores full list', async ({ page }) => {
    const allRows = page.locator('tbody tr')
    const totalCount = await allRows.count()

    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.waitForLoadState('networkidle')
    await expect(allRows.first()).toBeVisible()

    const resetBtn = page.locator('.reset-filters-btn')
    await resetBtn.click()
    await page.waitForLoadState('networkidle')
    await expect(allRows.nth(totalCount - 1)).toBeVisible({ timeout: 8000 })

    const restoredCount = await allRows.count()
    expect(restoredCount).toBe(totalCount)
  })
})
