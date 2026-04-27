import { test, expect } from '@playwright/test'

test.describe('Reports page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForSelector('h2', { timeout: 10000 })
  })

  test('renders page title and description', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Performance Reports')
    await expect(page.locator('.page-header p')).toBeVisible()
  })

  test('shows quarterly performance table with data', async ({ page }) => {
    await page.waitForSelector('.reports-table', { timeout: 10000 })
    const rows = page.locator('.reports-table').first().locator('tbody tr')
    await expect(rows).toHaveCount(4) // Q1–Q4 2025
    await expect(rows.first()).toContainText('Q1-2025')
  })

  test('quarterly table shows fulfillment rate badges', async ({ page }) => {
    await page.waitForSelector('.badge', { timeout: 10000 })
    const badges = page.locator('.reports-table .badge')
    await expect(badges.first()).toBeVisible()
  })

  test('shows monthly revenue trend chart', async ({ page }) => {
    await page.waitForSelector('.bar-chart', { timeout: 10000 })
    const bars = page.locator('.bar')
    await expect(bars).toHaveCount(12) // 12 months
  })

  test('shows month-over-month analysis table', async ({ page }) => {
    await page.waitForSelector('.reports-table', { timeout: 10000 })
    const tables = page.locator('.reports-table')
    await expect(tables).toHaveCount(2) // quarterly + monthly
    const monthlyRows = tables.nth(1).locator('tbody tr')
    await expect(monthlyRows).toHaveCount(12)
  })

  test('shows summary stat cards', async ({ page }) => {
    await page.waitForSelector('.stats-grid', { timeout: 10000 })
    const stats = page.locator('.stats-grid .stat-card')
    await expect(stats).toHaveCount(4)
    await expect(stats.nth(0)).toContainText('Total Revenue')
    await expect(stats.nth(2)).toContainText('Total Orders')
  })

  test('location filter updates data', async ({ page }) => {
    await page.waitForSelector('.reports-table', { timeout: 10000 })

    // Get total orders before filter
    const beforeText = await page.locator('.stats-grid .stat-card').nth(2).locator('.stat-value').textContent()
    const beforeCount = parseInt(beforeText.replace(/,/g, ''))

    // Apply Tokyo filter (Location is the 2nd select in FilterBar)
    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(800)

    const afterText = await page.locator('.stats-grid .stat-card').nth(2).locator('.stat-value').textContent()
    const afterCount = parseInt(afterText.replace(/,/g, ''))

    expect(afterCount).toBeLessThan(beforeCount)
  })

  test('category filter updates data', async ({ page }) => {
    await page.waitForSelector('.reports-table', { timeout: 10000 })

    const selects = page.locator('select')
    const categorySelect = selects.nth(2) // Category is 3rd select

    await categorySelect.selectOption('Sensors')
    await page.waitForTimeout(800)

    // Data should still render (not crash)
    await expect(page.locator('.reports-table').first()).toBeVisible()
  })

  test('Reports link is active in navbar when on reports page', async ({ page }) => {
    const reportsLink = page.locator('nav a[href="/reports"]')
    await expect(reportsLink).toHaveClass(/active/)
  })
})
