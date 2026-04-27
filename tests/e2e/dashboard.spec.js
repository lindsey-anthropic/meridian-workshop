const { test, expect } = require('@playwright/test')

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads and shows page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Catalyst Components')
    await expect(page.locator('h2')).toContainText('Overview')
  })

  test('shows KPI cards', async ({ page }) => {
    await expect(page.getByText('Inventory Turnover Rate')).toBeVisible()
    await expect(page.getByText('Orders Fulfilled')).toBeVisible()
    await expect(page.getByText('Order Fill Rate')).toBeVisible()
  })

  test('shows Order Health section with revenue', async ({ page }) => {
    await expect(page.getByText('Order Health')).toBeVisible()
    await expect(page.getByText('Revenue').first()).toBeVisible()
    await expect(page.getByText('Avg Order Value')).toBeVisible()
  })

  test('shows inventory value by category', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Inventory Value by Category' })).toBeVisible()
    await expect(page.locator('.h-bar-label').getByText('Circuit Boards')).toBeVisible()
    await expect(page.locator('.h-bar-label').getByText('Sensors')).toBeVisible()
  })

  test('filter by warehouse updates dashboard', async ({ page }) => {
    await page.locator('select').nth(1).selectOption('San Francisco')
    await page.waitForTimeout(500)

    // Dashboard should still show content (not crash)
    await expect(page.locator('h2')).toContainText('Overview')
    await expect(page.getByRole('heading', { name: 'Order Health' })).toBeVisible()
  })

  test('navigation links are all present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Inventory' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Restocking' })).toBeVisible()
  })
})
