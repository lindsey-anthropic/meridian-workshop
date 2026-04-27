import { test, expect } from '@playwright/test'

/**
 * Flow 6 — Reports module: quarterly and monthly trend rendering.
 *
 * Note: the proposal language was "with filters applied". The R1 audit (proposal section 3.4)
 * locked Reports as an unfiltered global view in v1 (decision U1). This spec asserts the
 * remediated behaviour: headings render, charts/tables populate, and the FilterBar is hidden
 * on the /reports route.
 */

test.describe('Flow 6 — Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
  })

  test('quarterly and monthly sections render', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Monthly Revenue Trend' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Month-over-Month Analysis' })).toBeVisible()
  })

  test('quarterly table populates with quarters', async ({ page }) => {
    const quarterlyTable = page.locator('table').first()
    await expect(quarterlyTable.locator('tbody tr')).not.toHaveCount(0)
    await expect(quarterlyTable).toContainText('Q1-2025')
  })

  test('summary stats render YTD totals', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Best Performing Quarter')).toBeVisible()
  })

  test('FilterBar is hidden on /reports per R1 decision U1', async ({ page }) => {
    await expect(page.locator('.filters-bar')).toHaveCount(0)
  })

  test('console is silent during Reports load (no console.log noise per R1 P3)', async ({ page }) => {
    const messages = []
    page.on('console', (msg) => {
      if (msg.type() === 'log') messages.push(msg.text())
    })
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
    // Exclude framework-level vite handshake logs; only flag application console.log noise.
    const appLogs = messages.filter((m) => !m.includes('[vite]'))
    expect(appLogs).toEqual([])
  })
})
