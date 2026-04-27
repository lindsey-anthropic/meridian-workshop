import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForFunction(() => !document.querySelector('.loading'))
  })

  test('shows page title', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Performance Reports')
  })

  test('renders Quarterly Performance table', async ({ page }) => {
    await expect(page.locator('h3').filter({ hasText: 'Quarterly Performance' }).first()).toBeVisible()
    const rows = page.locator('table').first().locator('tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('quarterly table has all required columns', async ({ page }) => {
    const texts = await page.locator('table').first().locator('thead th').allTextContents()
    const joined = texts.join(' ')
    expect(joined).toMatch(/Quarter/i)
    expect(joined).toMatch(/Total Orders/i)
    expect(joined).toMatch(/Revenue/i)
    expect(joined).toMatch(/Fulfillment/i)
  })

  test('renders Monthly Revenue Trend chart', async ({ page }) => {
    await expect(page.locator('text=Monthly Revenue Trend')).toBeVisible()
    const bars = page.locator('.bar')
    expect(await bars.count()).toBe(12)
  })

  test('renders Month-over-Month table', async ({ page }) => {
    await expect(page.locator('text=Month-over-Month Analysis')).toBeVisible()
    const rows = page.locator('table').last().locator('tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('renders summary stat cards', async ({ page }) => {
    await expect(page.locator('text=Total Revenue (YTD)')).toBeVisible()
    await expect(page.locator('text=Avg Monthly Revenue')).toBeVisible()
    await expect(page.locator('text=Total Orders (YTD)')).toBeVisible()
    await expect(page.locator('text=Best Performing Quarter')).toBeVisible()
  })

  test('Location filter reloads reports data', async ({ page }) => {
    const beforeRevenue = await page.locator('.stat-value').first().textContent()
    await page.getByRole('combobox').nth(1).selectOption('Tokyo')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    // Data should have changed (Tokyo subset is different from all)
    const afterRevenue = await page.locator('.stat-value').first().textContent()
    expect(afterRevenue).not.toBe(beforeRevenue)
  })

  test('Category filter reloads reports data', async ({ page }) => {
    const beforeRevenue = await page.locator('.stat-value').first().textContent()
    await page.getByRole('combobox').nth(2).selectOption('Sensors')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const afterRevenue = await page.locator('.stat-value').first().textContent()
    expect(afterRevenue).not.toBe(beforeRevenue)
  })

  test('no console errors on load', async ({ page }) => {
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto('/reports')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    expect(errors).toHaveLength(0)
  })
})
