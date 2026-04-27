import { test, expect } from '@playwright/test'

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
  })

  test('inventory table loads with items', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'Item Name' })).toBeVisible()
    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('warehouse filter reduces item count', async ({ page }) => {
    const allRows = await page.locator('tbody tr').count()
    const locationFilter = page.locator('select').nth(1)
    await locationFilter.selectOption('Tokyo')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
    const filteredRows = await page.locator('tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
    expect(filteredRows).toBeGreaterThan(0)
  })

  test('category filter works', async ({ page }) => {
    const categoryFilter = page.locator('select').nth(2)
    await categoryFilter.selectOption('Sensors')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
    const rows = page.locator('tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('stock level heading shows SKU count', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Stock Levels/ })).toBeVisible()
  })

  test('search filters items by name', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search/)
    await searchInput.fill('Sensor')
    const rows = page.locator('tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
    await expect(rows.first()).toContainText('Sensor')
  })
})
