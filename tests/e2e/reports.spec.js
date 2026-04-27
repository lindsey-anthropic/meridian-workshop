import { test, expect } from '@playwright/test'

test.describe('Reports view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForLoadState('networkidle')
  })

  test('loads quarterly and monthly data', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('warehouse filter changes report data', async ({ page }) => {
    const beforeCells = await page.locator('table tbody tr td:nth-child(2)').allTextContents()
    const beforeTotal = beforeCells.reduce((s, t) => s + Number(t.replace(/,/g, '') || 0), 0)

    await page.locator('select').nth(1).selectOption('San Francisco')
    await page.waitForLoadState('networkidle')

    const afterCells = await page.locator('table tbody tr td:nth-child(2)').allTextContents()
    const afterTotal = afterCells.reduce((s, t) => s + Number(t.replace(/,/g, '') || 0), 0)

    expect(afterTotal).toBeLessThan(beforeTotal)
  })

  test('category filter changes report data', async ({ page }) => {
    const beforeCells = await page.locator('table tbody tr td:nth-child(2)').allTextContents()
    const beforeTotal = beforeCells.reduce((s, t) => s + Number(t.replace(/,/g, '') || 0), 0)

    await page.locator('select').nth(2).selectOption('Sensors')
    await page.waitForLoadState('networkidle')

    const afterCells = await page.locator('table tbody tr td:nth-child(2)').allTextContents()
    const afterTotal = afterCells.reduce((s, t) => s + Number(t.replace(/,/g, '') || 0), 0)

    expect(afterTotal).toBeLessThan(beforeTotal)
  })

  test('summary stats are displayed', async ({ page }) => {
    const statValues = page.locator('.stat-value')
    await expect(statValues.first()).toBeVisible()
    const count = await statValues.count()
    expect(count).toBe(4)
  })
})
