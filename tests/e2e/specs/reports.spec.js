const { test, expect } = require('@playwright/test')

// Locate the Reports summary stat card by its label, then read its value.
const statValue = (page, label) =>
  page.locator('.stat-card', { hasText: label }).locator('.stat-value')

// The shared Location filter is the <select> that offers the warehouse options.
const locationFilter = (page) =>
  page.locator('select').filter({ has: page.locator('option', { hasText: 'San Francisco' }) })

test.describe('Reports module (R1 remediation protection)', () => {
  test('renders all report sections', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Monthly Revenue Trend' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Month-over-Month Analysis' })).toBeVisible()
  })

  test('shows YTD totals with locale-aware currency formatting', async ({ page }) => {
    await page.goto('/reports')
    // Unfiltered: all 250 orders are summarized
    await expect(statValue(page, 'Total Orders (YTD)')).toHaveText('250')
    // Currency rendered as $ with thousands separators (no broken decimals)
    await expect(statValue(page, 'Total Revenue (YTD)')).toHaveText(/^\$[\d,]+$/)
  })

  test('loads with a clean console (no errors)', async ({ page }) => {
    const errors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/reports')
    await expect(statValue(page, 'Total Orders (YTD)')).toHaveText('250')

    expect(errors).toEqual([])
  })

  test('filters are reactive and reset works', async ({ page }) => {
    await page.goto('/reports')
    await expect(statValue(page, 'Total Orders (YTD)')).toHaveText('250')

    // Filtering to Tokyo recomputes the whole report (250 -> 88 orders)
    await locationFilter(page).selectOption('Tokyo')
    await expect(statValue(page, 'Total Orders (YTD)')).toHaveText('88')

    // Reset returns to the full dataset
    const reset = page.getByRole('button', { name: 'Reset all filters' })
    await expect(reset).toBeEnabled()
    await reset.click()
    await expect(statValue(page, 'Total Orders (YTD)')).toHaveText('250')
  })
})
