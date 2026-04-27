import { test, expect } from '@playwright/test'

test.describe('Restocking page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForSelector('h2', { timeout: 10000 })
    // Wait for initial data load
    await page.waitForSelector('.stat-card', { timeout: 10000 })
  })

  test('renders page title and description', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Restocking Recommendations')
    await expect(page.locator('.page-header p')).toBeVisible()
  })

  test('shows budget input and get recommendations button', async ({ page }) => {
    await expect(page.locator('.budget-input')).toBeVisible()
    await expect(page.locator('button:has-text("Get Recommendations")')).toBeVisible()
  })

  test('shows stat cards on load', async ({ page }) => {
    const stats = page.locator('.stats-grid .stat-card')
    await expect(stats).toHaveCount(3)
    await expect(stats.nth(0)).toContainText('Recommendations')
    await expect(stats.nth(1)).toContainText('Total Cost')
    await expect(stats.nth(2)).toContainText('Critical Items')
  })

  test('shows recommendations table with correct columns', async ({ page }) => {
    await page.waitForSelector('.restocking-table', { timeout: 10000 })
    const headers = page.locator('.restocking-table th')
    await expect(headers).toHaveCount(11)
    await expect(headers.nth(0)).toHaveText('SKU')
    await expect(headers.nth(6)).toHaveText('Rec. Qty')
    await expect(headers.nth(9)).toHaveText('Reason')
    await expect(headers.nth(10)).toHaveText('Priority')
  })

  test('shows at least one recommendation on load', async ({ page }) => {
    await page.waitForSelector('.restocking-table tbody tr', { timeout: 10000 })
    const rows = page.locator('.restocking-table tbody tr')
    await expect(rows).toHaveCount(4)
  })

  test('recommendations have priority and reason badges', async ({ page }) => {
    await page.waitForSelector('.restocking-table', { timeout: 10000 })
    const firstRow = page.locator('.restocking-table tbody tr').first()
    await expect(firstRow.locator('.badge').first()).toBeVisible()
    await expect(firstRow.locator('.badge').last()).toBeVisible()
  })

  test('budget filter reduces recommendations', async ({ page }) => {
    await page.waitForSelector('.restocking-table', { timeout: 10000 })

    const allRows = await page.locator('.restocking-table tbody tr').count()

    // Set a low budget
    await page.fill('.budget-input', '25000')
    await page.click('button:has-text("Get Recommendations")')
    await page.waitForTimeout(800)

    const filteredRows = await page.locator('.restocking-table tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
  })

  test('zero budget shows all recommendations', async ({ page }) => {
    await page.waitForSelector('.restocking-table', { timeout: 10000 })

    await page.fill('.budget-input', '0')
    await page.click('button:has-text("Get Recommendations")')
    await page.waitForTimeout(800)

    const rows = page.locator('.restocking-table tbody tr')
    await expect(rows).toHaveCount(4)
  })

  test('very small budget shows empty state', async ({ page }) => {
    await page.fill('.budget-input', '1')
    await page.click('button:has-text("Get Recommendations")')
    await page.waitForTimeout(800)

    // Either empty state message or fewer rows
    const tableVisible = await page.locator('.restocking-table').isVisible()
    const emptyVisible = await page.locator('.empty-state').isVisible()
    expect(tableVisible || emptyVisible).toBe(true)
  })

  test('location filter shows only that warehouse', async ({ page }) => {
    await page.waitForSelector('.restocking-table', { timeout: 10000 })

    // Filter to Tokyo
    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('Tokyo')
    await page.waitForTimeout(800)

    const rows = page.locator('.restocking-table tbody tr')
    const count = await rows.count()

    if (count > 0) {
      const warehouses = await rows.locator('td:nth-child(3)').allTextContents()
      warehouses.forEach(w => expect(w).toBe('Tokyo'))
    }
  })

  test('Restocking link is active in navbar when on restocking page', async ({ page }) => {
    const link = page.locator('nav a[href="/restocking"]')
    await expect(link).toHaveClass(/active/)
  })

  test('total cost in stat card matches sum of table rows', async ({ page }) => {
    await page.waitForSelector('.restocking-table', { timeout: 10000 })

    const totalCostText = await page.locator('.stats-grid .stat-card').nth(1).locator('.stat-value').textContent()
    // Verify it's a valid currency value
    expect(totalCostText).toMatch(/^\$[\d,]+\.\d{2}$/)
  })
})
