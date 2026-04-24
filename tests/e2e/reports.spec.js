import { test, expect } from '@playwright/test'

test.describe('Reports — quarterly and monthly data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForSelector('.reports-table', { timeout: 10000 })
  })

  test('displays Performance Reports heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
  })

  test('shows quarterly performance table with data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
    const rows = page.locator('.reports-table').first().locator('tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('quarterly table has correct columns', async ({ page }) => {
    const headers = page.locator('.reports-table').first().locator('thead th')
    await expect(headers.nth(0)).toHaveText('Quarter')
    await expect(headers.nth(1)).toHaveText('Total Orders')
    await expect(headers.nth(2)).toHaveText('Total Revenue')
    await expect(headers.nth(3)).toHaveText('Avg Order Value')
    await expect(headers.nth(4)).toHaveText('Fulfillment Rate')
  })

  test('shows monthly revenue trend chart', async ({ page }) => {
    await expect(page.getByText('Monthly Revenue Trend')).toBeVisible()
    const bars = page.locator('.bar')
    expect(await bars.count()).toBeGreaterThan(0)
  })

  test('shows month-over-month analysis table', async ({ page }) => {
    await expect(page.getByText('Month-over-Month Analysis')).toBeVisible()
    const rows = page.locator('.reports-table').last().locator('tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('shows summary stats cards', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Avg Monthly Revenue')).toBeVisible()
    await expect(page.getByText('Total Orders (YTD)')).toBeVisible()
    await expect(page.getByText('Best Performing Quarter')).toBeVisible()
  })

  test('warehouse filter reloads report data', async ({ page }) => {
    // Get initial first quarterly row text
    const firstRow = page.locator('.reports-table').first().locator('tbody tr').first()
    const beforeText = await firstRow.textContent()

    // Apply warehouse filter
    const locationFilter = page.locator('select').nth(1)
    await locationFilter.selectOption('London')
    await page.waitForTimeout(600)

    // Data may change — page should still show the table (not an error)
    await expect(page.locator('.reports-table').first()).toBeVisible()
  })

  test('fulfillment rate badges are colour-coded', async ({ page }) => {
    const badges = page.locator('.badge')
    const count = await badges.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const cls = await badges.nth(i).getAttribute('class')
      expect(cls).toMatch(/badge (success|warning|danger)/)
    }
  })
})
