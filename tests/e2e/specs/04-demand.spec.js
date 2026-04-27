import { test, expect } from '@playwright/test'

/**
 * Flow 4 — Demand forecast view, including time-period switching.
 * Per proposal section 3.3.
 */

test.describe('Flow 4 — Demand Forecast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demand')
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
  })

  test('renders demand forecast view with content', async ({ page }) => {
    // The view should render at minimum a heading and either a table or summary content.
    const main = page.locator('main')
    await expect(main).toContainText(/[A-Za-z]/)
    // At least one of: trend bucket headings or a forecast table.
    const hasTrendOrTable = page.locator('h3, table').first()
    await expect(hasTrendOrTable).toBeVisible()
  })

  test('time period filter triggers reload without breaking the view', async ({ page }) => {
    const periodSelect = page.locator('.filter-group').filter({ hasText: 'Time Period' }).locator('select')
    await periodSelect.selectOption('2025-06')
    // Demand endpoint takes no filter param; backend ignores Time Period for this endpoint,
    // but the view should not error. Confirm the heading still renders.
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
  })
})
