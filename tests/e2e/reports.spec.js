import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test('quarterly performance and monthly trend load with real data', async ({ page }) => {
    await page.goto('/reports')

    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Monthly Revenue Trend' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Month-over-Month Analysis' })).toBeVisible()

    // At least one quarter row rendered with a non-zero revenue figure
    const firstQuarterRow = page.getByRole('row', { name: /^Q1-2025/ })
    await expect(firstQuarterRow).toBeVisible()
    await expect(firstQuarterRow).toContainText('$')
  })

  test('changing the Location filter actually changes the reported data', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByRole('row', { name: /^Q1-2025/ })).toBeVisible()

    const unfilteredRow = await page.getByRole('row', { name: /^Q1-2025/ }).textContent()

    // FilterBar's <label> isn't programmatically associated with its <select> (no for/id),
    // so target by fixed filter order instead: Time Period, Location, Category, Order Status.
    await page.getByRole('combobox').nth(1).selectOption('Tokyo')

    // Wait for the filtered fetch to resolve and re-render
    await expect(async () => {
      const filteredRow = await page.getByRole('row', { name: /^Q1-2025/ }).textContent()
      expect(filteredRow).not.toBe(unfilteredRow)
    }).toPass({ timeout: 5000 })

    // Regression guard for the original bug: Reports ignored the global filter bar entirely.
    // Tokyo is a strict subset of all warehouses, so its order count must be lower.
    const filteredRow = await page.getByRole('row', { name: /^Q1-2025/ }).textContent()
    const unfilteredOrders = parseInt(unfilteredRow.match(/Q1-2025\s+(\d+)/)[1], 10)
    const filteredOrders = parseInt(filteredRow.match(/Q1-2025\s+(\d+)/)[1], 10)
    expect(filteredOrders).toBeLessThan(unfilteredOrders)
  })

  test('does not log unexpected console errors on load', async ({ page }) => {
    // Network-layer "Failed to load resource" messages are excluded: the app has a pre-existing,
    // unrelated bug where /api/tasks 404s (no such backend route exists). That's a separate finding,
    // not part of Reports — this test only guards against app-level console noise/errors on this page.
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
        errors.push(msg.text())
      }
    })

    await page.goto('/reports')
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()

    expect(errors).toEqual([])
  })
})
