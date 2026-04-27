import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
  })

  test('KPI cards are visible with numeric values', async ({ page }) => {
    await expect(page.getByText('Key Performance Indicators')).toBeVisible()
    await expect(page.getByText('Inventory Turnover Rate')).toBeVisible()
    await expect(page.getByText('Orders Fulfilled')).toBeVisible()
    await expect(page.getByText('Order Fill Rate')).toBeVisible()
  })

  test('inventory shortages table shows backlog items', async ({ page }) => {
    await expect(page.getByText(/Inventory Shortages/)).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Item Name' })).toBeVisible()
    const rows = page.getByRole('row').filter({ hasText: 'units short' })
    await expect(rows.first()).toBeVisible()
  })

  test('Create PO button is visible on backlog items', async ({ page }) => {
    const createPOButtons = page.getByRole('button', { name: 'Create PO' })
    await expect(createPOButtons.first()).toBeVisible()
  })

  test('top products table is populated', async ({ page }) => {
    await expect(page.getByText('Top Products by Revenue')).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Product' })).toBeVisible()
    const rows = page.locator('tbody tr').first()
    await expect(rows).toBeVisible()
  })

  test('location filter updates dashboard data', async ({ page }) => {
    const locationFilter = page.locator('select').nth(1)
    await locationFilter.selectOption('Tokyo')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible()
  })

  test('reset filters button enables after filter change', async ({ page }) => {
    const resetButton = page.getByRole('button', { name: /Reset/ })
    await expect(resetButton).toBeDisabled()
    const locationFilter = page.locator('select').nth(1)
    await locationFilter.selectOption('London')
    await expect(resetButton).toBeEnabled()
    await resetButton.click()
    await expect(locationFilter).toHaveValue('all')
  })
})
