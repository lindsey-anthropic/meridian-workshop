// R1 — Reports module remediation
// These tests verify that the Reports page correctly loads data and responds to filter changes.

const { test, expect } = require('@playwright/test')

test.describe('Reports Page', () => {
  test('loads with quarterly performance table', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()

    for (const quarter of ['Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025']) {
      await expect(page.getByRole('cell', { name: quarter })).toBeVisible()
    }
  })

  test('loads monthly trend table with all 12 months', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByRole('heading', { name: 'Month-over-Month Analysis' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Jan 2025' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Dec 2025' })).toBeVisible()
  })

  test('summary stats section is visible', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Total Orders (YTD)')).toBeVisible()
    await expect(page.getByText('Best Performing Quarter')).toBeVisible()
    await expect(page.getByText('Q4-2025').first()).toBeVisible()
  })

  test('location filter reduces quarterly order counts', async ({ page }) => {
    await page.goto('/reports')

    // Record unfiltered Q1 order count (should be 62 across all warehouses)
    const q1Row = page.getByRole('row', { name: /Q1-2025/ })
    const q1OrdersUnfiltered = await q1Row.getByRole('cell').nth(1).textContent()
    const unfiltered = parseInt(q1OrdersUnfiltered.trim())

    // Apply Tokyo filter
    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(600)

    const q1OrdersFiltered = await q1Row.getByRole('cell').nth(1).textContent()
    const filtered = parseInt(q1OrdersFiltered.trim())

    expect(filtered).toBeLessThan(unfiltered)
    expect(filtered).toBeGreaterThan(0)
  })

  test('status filter reduces quarterly order counts', async ({ page }) => {
    await page.goto('/reports')

    const q1Row = page.getByRole('row', { name: /Q1-2025/ })
    const unfiltered = parseInt((await q1Row.getByRole('cell').nth(1).textContent()).trim())

    // Filter to Delivered only — a subset of all orders
    await page.locator('select').nth(3).selectOption('Delivered')
    await page.waitForTimeout(600)

    const filtered = parseInt((await q1Row.getByRole('cell').nth(1).textContent()).trim())
    expect(filtered).toBeLessThan(unfiltered)
  })

  test('month filter shows single-month data', async ({ page }) => {
    await page.goto('/reports')

    const q1Row = page.getByRole('row', { name: /Q1-2025/ })
    const unfiltered = parseInt((await q1Row.getByRole('cell').nth(1).textContent()).trim())

    // January only — should be a fraction of Q1's total
    await page.locator('select').nth(0).selectOption('January')
    await page.waitForTimeout(600)

    const filtered = parseInt((await q1Row.getByRole('cell').nth(1).textContent()).trim())
    expect(filtered).toBeLessThan(unfiltered)
  })
})
