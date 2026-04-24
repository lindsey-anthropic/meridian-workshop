import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('shows KPI section with key metrics', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Key Performance Indicators' })).toBeVisible()
    await expect(page.getByText('Inventory Turnover Rate')).toBeVisible()
    await expect(page.getByText('Orders Fulfilled')).toBeVisible()
    await expect(page.getByText('Order Fill Rate')).toBeVisible()
    await expect(page.getByText('Avg Processing Time (Days)')).toBeVisible()
  })

  test('shows order health section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Order Health' })).toBeVisible()
    // Order Health stats visible below the donut chart
    await expect(page.getByText('On-Time Rate')).toBeVisible()
    await expect(page.getByText('Avg Fulfillment (Days)')).toBeVisible()
    await expect(page.getByText('Avg Order Value')).toBeVisible()
  })

  test('shows inventory value by category', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Inventory Value by Category' })).toBeVisible()
    // Chart bar labels are in .h-bar-label divs — scope to avoid matching filter/table cells
    await expect(page.locator('.h-bar-label', { hasText: 'Circuit Boards' })).toBeVisible()
    await expect(page.locator('.h-bar-label', { hasText: 'Sensors' })).toBeVisible()
    await expect(page.locator('.h-bar-label', { hasText: 'Actuators' })).toBeVisible()
  })

  test('shows inventory shortages table with data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Inventory Shortages/ })).toBeVisible()
    const table = page.getByRole('table').first()
    await expect(table).toBeVisible()
    await expect(table.getByText('Order ID')).toBeVisible()
    await expect(table.getByText('Item Name')).toBeVisible()
    await expect(table.getByText('Shortage')).toBeVisible()
    await expect(table.getByText('Priority')).toBeVisible()
    // At least one shortage row should exist
    const rowCount = await table.getByRole('row').count()
    expect(rowCount).toBeGreaterThan(1) // header + at least 1 data row
  })

  test('shows top products table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Top Products by Revenue' })).toBeVisible()
    const topProductsTable = page.getByRole('table').last()
    await expect(topProductsTable.getByRole('columnheader', { name: 'Product' })).toBeVisible()
    await expect(topProductsTable.getByRole('columnheader', { name: 'Revenue' })).toBeVisible()
    await expect(topProductsTable.getByRole('columnheader', { name: 'Stock Status' })).toBeVisible()
  })

  test('location filter updates without error', async ({ page }) => {
    // Location is the 2nd combobox (index 1) in the filter bar
    await page.getByRole('combobox').nth(1).selectOption('San Francisco')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Order Health' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Key Performance Indicators' })).toBeVisible()
  })
})
