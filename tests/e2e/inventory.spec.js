const { test, expect } = require('@playwright/test')

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await page.waitForSelector('table', { timeout: 5000 })
  })

  test('loads inventory table', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Inventory')
    await expect(page.locator('table')).toBeVisible()
  })

  test('shows inventory items with required columns', async ({ page }) => {
    await expect(page.locator('table thead').getByText('SKU')).toBeVisible()
    await expect(page.locator('table thead').getByText('Category')).toBeVisible()
    await expect(page.locator('table thead').getByText('Location')).toBeVisible()
    await expect(page.locator('table thead').getByText('Quantity on Hand')).toBeVisible()
  })

  test('filter by warehouse reduces items', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()

    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(500)

    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
    expect(filteredRows).toBeGreaterThan(0)
  })

  test('filter by category reduces items', async ({ page }) => {
    await page.locator('select').nth(2).selectOption('sensors')
    await page.waitForTimeout(500)

    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)

    // Every visible row should be in Sensors category
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('Sensors')
    }
  })

  test('reset filters button works', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()

    await page.locator('select').nth(1).selectOption('London')
    await page.waitForTimeout(300)

    await page.getByTitle('Reset all filters').click()
    await page.waitForTimeout(500)

    const resetRows = await page.locator('table tbody tr').count()
    expect(resetRows).toEqual(allRows)
  })

  test('search by item name filters table', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i)
    if (await searchInput.isVisible()) {
      await searchInput.fill('Sensor')
      await page.waitForTimeout(300)
      const rows = await page.locator('table tbody tr').count()
      expect(rows).toBeGreaterThan(0)
    }
  })
})
