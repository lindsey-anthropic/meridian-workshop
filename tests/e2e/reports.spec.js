import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForSelector('table')
  })

  test('loads quarterly performance table', async ({ page }) => {
    await expect(page.locator('h3', { hasText: 'Quarterly Performance' })).toBeVisible()
    const count = await page.locator('table').first().locator('tbody tr').count()
    expect(count).toBeGreaterThan(0)
  })

  test('quarterly table has expected columns', async ({ page }) => {
    const headers = page.locator('table').first().locator('th')
    await expect(headers).toContainText(['Quarter', 'Total Orders', 'Total Revenue', 'Avg Order Value', 'Fulfillment Rate'])
  })

  test('loads monthly revenue trend chart', async ({ page }) => {
    await expect(page.locator('h3', { hasText: 'Monthly Revenue Trend' })).toBeVisible()
    const count = await page.locator('.bar').count()
    expect(count).toBeGreaterThan(0)
  })

  test('loads month-over-month analysis table', async ({ page }) => {
    await expect(page.locator('h3', { hasText: 'Month-over-Month' })).toBeVisible()
    const count = await page.locator('table').last().locator('tbody tr').count()
    expect(count).toBeGreaterThan(0)
  })

  test('shows summary stats', async ({ page }) => {
    const count = await page.locator('.stat-card').count()
    expect(count).toBeGreaterThan(0)
    await expect(page.locator('.stat-value').first()).not.toBeEmpty()
  })

  test('no unexpected console errors on load', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('404') && !msg.text().includes('tasks')) {
        errors.push(msg.text())
      }
    })
    await page.reload()
    await page.waitForSelector('table')
    expect(errors).toHaveLength(0)
  })
})
