import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
  })

  test('quarterly performance table loads', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Quarter' })).toBeVisible()
    const rows = page.locator('tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('all four quarters are shown', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'Q1-2025' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Q2-2025' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Q3-2025' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Q4-2025' })).toBeVisible()
  })

  test('fulfillment rate is always shown', async ({ page }) => {
    const fulfillmentCells = page.locator('.badge')
    const count = await fulfillmentCells.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const text = await fulfillmentCells.nth(i).textContent()
      expect(text).toMatch(/\d+(\.\d+)?%/)
    }
  })

  test('monthly revenue trend chart is visible', async ({ page }) => {
    await expect(page.getByText('Monthly Revenue Trend')).toBeVisible()
    const bars = page.locator('.bar')
    const count = await bars.count()
    expect(count).toBeGreaterThan(0)
  })

  test('month-over-month table is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Month-over-Month Analysis' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Growth Rate' })).toBeVisible()
  })

  test('summary stat cards are shown', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Avg Monthly Revenue')).toBeVisible()
    await expect(page.getByText('Total Orders (YTD)')).toBeVisible()
    await expect(page.getByText('Best Performing Quarter')).toBeVisible()
  })

  test('warehouse filter updates report data', async ({ page }) => {
    const locationFilter = page.locator('select').nth(1)
    await locationFilter.selectOption('San Francisco')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
  })

  test('labels switch to Japanese', async ({ page }) => {
    const langButton = page.getByRole('button', { name: /English/ })
    await langButton.click()
    await page.getByText('日本語').click()
    await expect(page.getByRole('heading', { name: 'パフォーマンスレポート' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '四半期パフォーマンス' })).toBeVisible()
    // reset locale
    await page.getByRole('button', { name: /日本語/ }).click()
    await page.getByText('English').click()
  })
})
