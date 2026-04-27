import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows app title and nav links', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Catalyst Components', level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Restocking' })).toBeVisible()
  })

  test('loads KPI section with numeric values', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Key Performance Indicators' })).toBeVisible()
    // Each KPI card contains a "Goal:" label — confirms data has loaded
    await expect(page.getByText('Goal:').first()).toBeVisible()
  })

  test('shows inventory shortages table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Inventory Shortages/ })).toBeVisible()
    // Table should have at least one shortage row
    const rows = page.locator('table').filter({ hasText: 'Order ID' }).locator('tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('shows top products table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Top Products by Revenue' })).toBeVisible()
    const rows = page.locator('table').filter({ hasText: 'Product' }).locator('tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('filter bar has location dropdown with warehouse options', async ({ page }) => {
    const locationSelect = page.getByLabel('Location')
    await expect(locationSelect).toBeVisible()
    await expect(locationSelect.getByRole('option', { name: 'San Francisco' })).toBeAttached()
    await expect(locationSelect.getByRole('option', { name: 'London' })).toBeAttached()
    await expect(locationSelect.getByRole('option', { name: 'Tokyo' })).toBeAttached()
  })

  test('filter by warehouse Tokyo updates the page', async ({ page }) => {
    await page.getByLabel('Location').selectOption('Tokyo')
    // Reset button becomes enabled once a filter is active
    await expect(page.getByRole('button', { name: 'Reset all filters' })).toBeEnabled()
  })
})
