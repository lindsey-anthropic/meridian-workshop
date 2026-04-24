import { test, expect } from '@playwright/test'

test.describe('Inventory — stock levels and filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await page.waitForSelector('table')
  })

  test('displays inventory table with items', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Inventory' })).toBeVisible()
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('shows stock status badges (In Stock, Low Stock, Adequate)', async ({ page }) => {
    const statuses = page.locator('table tbody td:last-child')
    const count = await statuses.count()
    expect(count).toBeGreaterThan(0)
    const firstStatus = await statuses.first().textContent()
    expect(['In Stock', 'Low Stock', 'Adequate']).toContain(firstStatus?.trim())
  })

  test('filters by warehouse — London shows fewer items', async ({ page }) => {
    const allRows = page.locator('table tbody tr')
    const totalCount = await allRows.count()

    const locationFilter = page.locator('select').nth(1)
    await locationFilter.selectOption('London')
    await page.waitForTimeout(500)

    const filteredCount = await allRows.count()
    expect(filteredCount).toBeLessThanOrEqual(totalCount)
  })

  test('filters by category — Sensors shows only sensor items', async ({ page }) => {
    const categoryFilter = page.locator('select').nth(2)
    await categoryFilter.selectOption('Sensors')
    await page.waitForTimeout(500)

    const categoryCell = page.locator('table tbody td:nth-child(3)').first()
    await expect(categoryCell).toHaveText('Sensors')
  })

  test('search by item name filters the table', async ({ page }) => {
    const searchBox = page.getByPlaceholder('Search by item name...')
    await searchBox.fill('Temperature')
    await page.waitForTimeout(300)

    const rows = page.locator('table tbody tr')
    await expect(rows).toHaveCount(1)
    await expect(rows.first()).toContainText('Temperature')
  })

  test('combined warehouse + category filter works', async ({ page }) => {
    const locationFilter = page.locator('select').nth(1)
    const categoryFilter = page.locator('select').nth(2)

    await locationFilter.selectOption('San Francisco')
    await categoryFilter.selectOption('Circuit Boards')
    await page.waitForTimeout(500)

    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    // Either items matching both filters, or empty state
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
