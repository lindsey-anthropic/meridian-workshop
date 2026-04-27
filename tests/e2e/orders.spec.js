import { test, expect } from '@playwright/test'

test.describe('Orders view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/orders')
    await page.waitForLoadState('networkidle')
  })

  test('loads and displays orders', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
    const rows = page.locator('table tbody tr')
    await expect(rows).not.toHaveCount(0)
  })

  test('filter by status reduces results', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()

    await page.locator('select').nth(3).selectOption('Delivered')
    await page.waitForLoadState('networkidle')

    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeGreaterThan(0)
    expect(filteredRows).toBeLessThan(allRows)
  })

  test('filter by month reduces results', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()

    await page.locator('select').nth(0).selectOption('2025-03')
    await page.waitForLoadState('networkidle')

    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeGreaterThan(0)
    expect(filteredRows).toBeLessThan(allRows)
  })

  test('status badges are visible', async ({ page }) => {
    const badges = page.locator('.badge')
    await expect(badges.first()).toBeVisible()
  })
})
