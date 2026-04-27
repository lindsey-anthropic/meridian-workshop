import { test, expect } from '@playwright/test'

/**
 * Flow 1 — Dashboard load with default filters across all three warehouses.
 * Per proposal section 3.3.
 */

test.describe('Flow 1 — Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible()
  })

  test('KPI cards and summary sections render after load', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Key Performance Indicators' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Order Health' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Inventory Value by Category' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Top Products by Revenue' })).toBeVisible()
  })

  test('default Location filter is All — data spans every warehouse', async ({ page }) => {
    const locationSelect = page.locator('.filter-group').filter({ hasText: 'Location' }).locator('select')
    await expect(locationSelect).toHaveValue('all')

    const topProducts = page.locator('table').last()
    await expect(topProducts.locator('tbody tr')).not.toHaveCount(0)
  })

  test('Location filter narrows the dashboard reactively', async ({ page }) => {
    const locationSelect = page.locator('.filter-group').filter({ hasText: 'Location' }).locator('select')
    const apiCall = page.waitForResponse((resp) =>
      resp.url().includes('/api/dashboard/summary') && resp.url().includes('warehouse=Tokyo')
    )
    await locationSelect.selectOption('Tokyo')
    await apiCall
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible()
  })
})
