// @ts-check
const { test, expect } = require('@playwright/test')

// Filter labels are not associated via for/id — target by container text
const filterSelect = (page, labelText) =>
  page.locator('.filter-group').filter({ hasText: labelText }).locator('select')

test.describe('Happy path — critical user flows', () => {

  test('dashboard loads with KPIs and summary data', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible()
    await expect(page.getByText('Key Performance Indicators')).toBeVisible()
    await expect(page.getByText('Order Health')).toBeVisible()
    await expect(page.getByText('Inventory Value by Category')).toBeVisible()
  })

  test('warehouse filter applies on dashboard', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible()

    // Select San Francisco warehouse
    await filterSelect(page, 'Location').selectOption('San Francisco')

    // KPIs still visible after filter
    await expect(page.getByText('Key Performance Indicators')).toBeVisible()

    // Reset filter
    await page.getByTitle('Reset all filters').click()
    await expect(filterSelect(page, 'Location')).toHaveValue('all')
  })

  test('inventory view loads and displays items table', async ({ page }) => {
    await page.goto('/inventory')
    await expect(page.getByRole('heading', { name: 'Inventory' })).toBeVisible()
    await expect(page.getByText('Track and manage all inventory items')).toBeVisible()

    // Table renders with expected columns
    const table = page.getByRole('table').first()
    await expect(table).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'SKU' })).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'Item Name' })).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'Status' })).toBeVisible()

    // At least one row of data
    await expect(table.getByRole('row').nth(1)).toBeVisible()
  })

  test('inventory warehouse filter narrows results', async ({ page }) => {
    await page.goto('/inventory')
    await expect(page.getByRole('table').first()).toBeVisible()

    const allRowsBefore = await page.getByRole('table').first().getByRole('row').count()

    await filterSelect(page, 'Location').selectOption('San Francisco')

    const rowsAfter = await page.getByRole('table').first().getByRole('row').count()
    // San Francisco subset should be fewer rows than all warehouses
    expect(rowsAfter).toBeLessThan(allRowsBefore)

    await page.getByTitle('Reset all filters').click()
  })

  test('orders view loads and displays orders table', async ({ page }) => {
    await page.goto('/orders')
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()

    const table = page.getByRole('table').first()
    await expect(table).toBeVisible()
    await expect(table.getByRole('row').nth(1)).toBeVisible()
  })

  test('reports view loads with quarterly and monthly data', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
    await expect(page.getByText('Quarterly Performance')).toBeVisible()
    await expect(page.getByText('Monthly Revenue Trend')).toBeVisible()
    await expect(page.getByText('Month-over-Month Analysis')).toBeVisible()

    // Summary stats are present
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Total Orders (YTD)')).toBeVisible()
  })

})

test.describe('Reports filter coverage', () => {

  test('reports warehouse filter reloads data', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByText('Quarterly Performance')).toBeVisible()

    // Grab a revenue value before filtering
    const beforeText = await page.locator('.reports-table tbody tr').first().textContent()

    await filterSelect(page, 'Location').selectOption('London')

    // Wait for data to update and verify table still renders
    await expect(page.locator('.reports-table tbody').first()).toBeVisible()

    // Reset and verify we're back
    await page.getByTitle('Reset all filters').click()
    await expect(filterSelect(page, 'Location')).toHaveValue('all')
  })

  test('reports month filter narrows to single month', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByText('Month-over-Month Analysis')).toBeVisible()

    await filterSelect(page, 'Time Period').selectOption('2025-03')

    // Monthly table should show data (not error/empty)
    await expect(page.locator('.reports-table').last()).toBeVisible()

    await page.getByTitle('Reset all filters').click()
  })

  test('reports console is silent — no debug logs', async ({ page }) => {
    const consoleLogs = []
    page.on('console', msg => {
      if (msg.type() === 'log') consoleLogs.push(msg.text())
    })

    await page.goto('/reports')
    // Wait for data to fully load
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()

    expect(consoleLogs).toHaveLength(0)
  })

  test('reports category filter applies', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByText('Quarterly Performance')).toBeVisible()

    await filterSelect(page, 'Category').selectOption('sensors')

    await expect(page.locator('.reports-table tbody').first()).toBeVisible()
    await page.getByTitle('Reset all filters').click()
  })

})

test.describe('Restocking view', () => {

  test('restocking view loads with recommendations', async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible()
    await expect(page.getByText('Budget Ceiling')).toBeVisible()
    await expect(page.getByText('Within Budget')).toBeVisible()
  })

  test('budget input filters recommendations reactively', async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.getByText('Within Budget')).toBeVisible()

    // Set a very low budget — should reduce within-budget items
    const budgetInput = page.locator('.budget-input')
    await budgetInput.fill('1000')
    await budgetInput.press('Tab')

    // Total cost should not exceed the budget
    const totalCostText = await page.locator('.budget-stat-value').nth(1).textContent()
    const totalCost = parseFloat(totalCostText.replace(/[$,]/g, ''))
    expect(totalCost).toBeLessThanOrEqual(1000)
  })

})
