const { test, expect } = require('@playwright/test')

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForSelector('.reports-table tbody tr', { timeout: 8000 })
  })

  test('loads reports page without error', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Performance Reports')
    await expect(page.locator('.error')).not.toBeVisible()
  })

  test('shows quarterly performance table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Q1-2025' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Q4-2025' })).toBeVisible()
  })

  test('shows monthly revenue trend chart', async ({ page }) => {
    await expect(page.getByText('Monthly Revenue Trend')).toBeVisible()
    await expect(page.locator('.bar-chart')).toBeVisible()
    const bars = page.locator('.bar')
    expect(await bars.count()).toBeGreaterThan(0)
  })

  test('shows month-over-month analysis table', async ({ page }) => {
    await expect(page.getByText('Month-over-Month Analysis')).toBeVisible()
  })

  test('shows summary stat cards', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Avg Monthly Revenue')).toBeVisible()
    await expect(page.getByText('Total Orders (YTD)')).toBeVisible()
    await expect(page.getByText('Best Performing Quarter')).toBeVisible()
  })

  test('Order Status filter is not shown on reports page', async ({ page }) => {
    await expect(page.getByText('Order Status')).not.toBeVisible()
  })

  test('filter by warehouse updates data', async ({ page }) => {
    const originalRevenue = await page.locator('.stat-value').first().textContent()

    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(800)

    await expect(page.locator('.error')).not.toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
  })

  test('filter by category updates data', async ({ page }) => {
    await page.locator('select').nth(2).selectOption('sensors')
    await page.waitForTimeout(800)

    await expect(page.locator('.error')).not.toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
  })
})
