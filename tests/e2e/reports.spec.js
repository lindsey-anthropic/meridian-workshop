import { test, expect } from '@playwright/test'

test.describe('Reports page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    // Wait for data to load — quarterly table must have rows
    await expect(page.locator('table').first().locator('tbody tr').first()).toBeVisible()
  })

  test('shows the page heading and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
    await expect(page.getByText('View quarterly performance metrics and monthly trends')).toBeVisible()
  })

  test('displays quarterly data for all four quarters', async ({ page }) => {
    const rows = page.locator('table').first().locator('tbody tr')
    await expect(rows).toHaveCount(4)
    await expect(rows.nth(0)).toContainText('Q1-2025')
    await expect(rows.nth(1)).toContainText('Q2-2025')
    await expect(rows.nth(2)).toContainText('Q3-2025')
    await expect(rows.nth(3)).toContainText('Q4-2025')
  })

  test('fulfillment rate is shown as a percentage badge', async ({ page }) => {
    const firstRateCell = page.locator('table').first().locator('tbody tr').first().locator('td').last()
    await expect(firstRateCell).toContainText('%')
  })

  test('shows monthly revenue trend chart with 12 months', async ({ page }) => {
    // Each month label appears in the bar chart
    const monthLabels = page.locator('.bar-label')
    await expect(monthLabels).toHaveCount(12)
    await expect(monthLabels.first()).toContainText('Jan')
    await expect(monthLabels.last()).toContainText('Dec')
  })

  test('shows month-over-month table with growth rate column', async ({ page }) => {
    const momTable = page.locator('table').nth(1)
    await expect(momTable.getByRole('columnheader', { name: 'Growth Rate' })).toBeVisible()
    // First row has no previous month so shows dash
    await expect(momTable.locator('tbody tr').first().locator('td').nth(4)).toContainText('-')
    // Second row has a growth rate
    await expect(momTable.locator('tbody tr').nth(1).locator('td').nth(4)).toContainText('%')
  })

  test('displays summary stats cards', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Avg Monthly Revenue')).toBeVisible()
    await expect(page.getByText('Total Orders (YTD)')).toBeVisible()
    await expect(page.getByText('Best Performing Quarter')).toBeVisible()
  })

  test('warehouse filter changes quarterly data', async ({ page }) => {
    // Record unfiltered Q1 order count
    const q1Cell = page.locator('table').first().locator('tbody tr').first().locator('td').nth(1)
    const unfiltered = await q1Cell.textContent()

    // Apply San Francisco filter
    await page.locator('.filter-select').nth(1).selectOption('San Francisco')
    await page.waitForTimeout(500)

    // Data must have changed (SF has fewer orders than all-warehouses)
    const filtered = await q1Cell.textContent()
    expect(filtered).not.toBe(unfiltered)
  })

  test('category filter changes quarterly data', async ({ page }) => {
    const revenueCell = page.locator('table').first().locator('tbody tr').first().locator('td').nth(2)
    const before = await revenueCell.textContent()

    await page.locator('.filter-select').nth(2).selectOption('Sensors')
    await page.waitForTimeout(500)

    const after = await revenueCell.textContent()
    expect(after).not.toBe(before)
  })

  test('Reports nav link is active when on reports page', async ({ page }) => {
    const reportsLink = page.getByRole('link', { name: 'Reports' })
    await expect(reportsLink).toHaveClass(/active/)
  })
})
