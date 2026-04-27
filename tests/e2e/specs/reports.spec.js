import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    // Wait for data to load — quarterly table appears after API response
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
  })

  test('shows page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Performance Reports', level: 2 })).toBeVisible()
  })

  test('quarterly table has four quarters', async ({ page }) => {
    const table = page.getByRole('table').filter({ hasText: 'Quarter' })
    await expect(table.getByRole('row', { name: /Q1-2025/ })).toBeVisible()
    await expect(table.getByRole('row', { name: /Q2-2025/ })).toBeVisible()
    await expect(table.getByRole('row', { name: /Q3-2025/ })).toBeVisible()
    await expect(table.getByRole('row', { name: /Q4-2025/ })).toBeVisible()
  })

  test('fulfillment rate is a percentage for completed quarters', async ({ page }) => {
    // Q1 and Q2 are complete — should show a % value, not N/A
    const q1Row = page.getByRole('row', { name: /Q1-2025/ })
    const q1Fulfillment = q1Row.getByRole('cell').last()
    await expect(q1Fulfillment).toContainText('%')
  })

  test('monthly revenue trend chart is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Monthly Revenue Trend' })).toBeVisible()
    // Chart renders 12 month labels
    await expect(page.getByText('Jan 2025')).toBeVisible()
    await expect(page.getByText('Dec 2025')).toBeVisible()
  })

  test('month-over-month table shows 12 months', async ({ page }) => {
    const table = page.getByRole('table').filter({ hasText: 'Month' })
    const rows = table.locator('tbody tr')
    await expect(rows).toHaveCount(12)
  })

  test('summary stats are visible', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Avg Monthly Revenue')).toBeVisible()
    await expect(page.getByText('Best Performing Quarter')).toBeVisible()
  })

  test('filter by warehouse reduces data', async ({ page }) => {
    // Capture total orders before filtering
    const allOrdersText = await page.getByRole('row', { name: /Q1-2025/ })
      .getByRole('cell').nth(1).textContent()

    await page.getByLabel('Location').selectOption('Tokyo')
    await page.waitForTimeout(500)

    const filteredOrdersText = await page.getByRole('row', { name: /Q1-2025/ })
      .getByRole('cell').nth(1).textContent()

    // Orders for a single warehouse should be ≤ all-warehouse total
    expect(Number(filteredOrdersText)).toBeLessThanOrEqual(Number(allOrdersText))
  })
})
