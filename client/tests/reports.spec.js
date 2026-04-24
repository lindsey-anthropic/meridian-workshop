import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForLoadState('networkidle')
  })

  test('renders page heading and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
    await expect(page.getByText('View quarterly performance metrics and monthly trends')).toBeVisible()
  })

  test('shows quarterly performance table with four quarters', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
    const table = page.getByRole('table').first()
    await expect(table.getByText('Q1-2025')).toBeVisible()
    await expect(table.getByText('Q2-2025')).toBeVisible()
    await expect(table.getByText('Q3-2025')).toBeVisible()
    await expect(table.getByText('Q4-2025')).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'Total Orders' })).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'Total Revenue' })).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'Fulfillment Rate' })).toBeVisible()
  })

  test('shows monthly revenue trend chart', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Monthly Revenue Trend' })).toBeVisible()
    // Chart bar labels — scope to .bar-label class to avoid matching table cells
    await expect(page.locator('.bar-label', { hasText: 'Jan 2025' })).toBeVisible()
    await expect(page.locator('.bar-label', { hasText: 'Jun 2025' })).toBeVisible()
    await expect(page.locator('.bar-label', { hasText: 'Dec 2025' })).toBeVisible()
  })

  test('shows month-over-month analysis table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Month-over-Month Analysis' })).toBeVisible()
    const tables = page.getByRole('table')
    const momTable = tables.last()
    await expect(momTable.getByRole('columnheader', { name: 'Orders' })).toBeVisible()
    await expect(momTable.getByRole('columnheader', { name: 'Growth Rate' })).toBeVisible()
    await expect(momTable.getByText('Jan 2025').first()).toBeVisible()
    await expect(momTable.getByText('Dec 2025')).toBeVisible()
  })

  test('shows YTD summary stats', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Avg Monthly Revenue')).toBeVisible()
    await expect(page.getByText('Total Orders (YTD)')).toBeVisible()
    await expect(page.getByText('Best Performing Quarter')).toBeVisible()
    // Q4-2025 appears both in table and stat — scope to the stat value div
    await expect(page.locator('.stat-value', { hasText: 'Q4-2025' })).toBeVisible()
  })

  test('location filter updates data without error', async ({ page }) => {
    // Location is the 2nd combobox (index 1) in the filter bar
    await page.getByRole('combobox').nth(1).selectOption('Tokyo')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Month-over-Month Analysis' })).toBeVisible()
  })

  test('category filter updates data without error', async ({ page }) => {
    // Category is the 3rd combobox (index 2) in the filter bar
    await page.getByRole('combobox').nth(2).selectOption('Sensors')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
    await expect(page.getByRole('table').first()).toBeVisible()
  })

  test('no console errors on load', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })
})
