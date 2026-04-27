import { test, expect } from '@playwright/test'

test.describe('Reports page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForSelector('.reports-table', { timeout: 10000 })
  })

  test('loads and displays quarterly performance table', async ({ page }) => {
    const rows = page.locator('.reports-table').first().locator('tbody tr')
    await expect(rows).toHaveCount(4) // Q1–Q4
    await expect(rows.first()).toContainText('Q1-2025')
    await expect(rows.last()).toContainText('Q4-2025')
  })

  test('quarterly table shows revenue and fulfillment rate', async ({ page }) => {
    const firstRow = page.locator('.reports-table tbody tr').first()
    // Revenue column should contain a currency value
    await expect(firstRow.locator('td').nth(2)).toContainText('$')
    // Fulfillment rate badge should be present
    await expect(firstRow.locator('.badge')).toBeVisible()
  })

  test('monthly revenue trend chart renders bars', async ({ page }) => {
    const bars = page.locator('.bar')
    await expect(bars).toHaveCount(12) // 12 months
    // Each bar should have a positive height style
    const firstBar = bars.first()
    const height = await firstBar.evaluate(el => el.style.height)
    expect(parseFloat(height)).toBeGreaterThan(0)
  })

  test('month-over-month table shows growth rates', async ({ page }) => {
    // Second and subsequent rows should have growth rate values (not just '-')
    const tables = page.locator('.reports-table')
    const momTable = tables.nth(1)
    const secondRow = momTable.locator('tbody tr').nth(1)
    const growthCell = secondRow.locator('td').nth(4)
    const text = await growthCell.innerText()
    expect(text).toMatch(/[+-]?\d+\.\d+%/)
  })

  test('summary stats display four KPI cards', async ({ page }) => {
    const statCards = page.locator('.stat-card')
    await expect(statCards).toHaveCount(4)
    await expect(statCards.nth(0)).toContainText('$')   // Total Revenue
    await expect(statCards.nth(2)).not.toContainText('$') // Total Orders (no currency)
  })

  test('warehouse filter updates report data', async ({ page }) => {
    // Get initial Q1 order count
    const firstRow = page.locator('.reports-table tbody tr').first()
    const initialOrders = await firstRow.locator('td').nth(1).innerText()

    // Select London warehouse filter (value matches FilterBar option value)
    const warehouseSelect = page.locator('.filter-select').nth(1)
    await warehouseSelect.selectOption('London')
    await page.waitForTimeout(500)

    // Order count should change (London has fewer orders than all warehouses)
    const filteredOrders = await firstRow.locator('td').nth(1).innerText()
    expect(Number(filteredOrders)).toBeLessThan(Number(initialOrders))
  })

  test('currency displays correctly in English locale', async ({ page }) => {
    const revenueCell = page.locator('.reports-table tbody tr').first().locator('td').nth(2)
    await expect(revenueCell).toContainText('$')
  })
})
