import { test, expect } from '@playwright/test'

test.describe('Restocking recommendations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForLoadState('networkidle')
  })

  test('loads with recommendations when no budget set', async ({ page }) => {
    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('shows items recommended stat card', async ({ page }) => {
    const statValues = page.locator('.stat-value')
    await expect(statValues.first()).toBeVisible()
    const text = await statValues.first().textContent()
    expect(parseInt(text)).toBeGreaterThan(0)
  })

  test('zero budget returns empty recommendations', async ({ page }) => {
    const budgetInput = page.locator('.budget-input')
    await budgetInput.fill('0')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')

    const emptyState = page.locator('.empty-state')
    await expect(emptyState).toBeVisible()
  })

  test('large budget shows all recommendations', async ({ page }) => {
    const rowsBefore = await page.locator('tbody tr').count()

    const budgetInput = page.locator('.budget-input')
    await budgetInput.fill('9999999')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')

    const rowsAfter = await page.locator('tbody tr').count()
    expect(rowsAfter).toBe(rowsBefore)
  })

  test('budget within range shows subset of recommendations', async ({ page }) => {
    const allRows = await page.locator('tbody tr').count()

    const budgetInput = page.locator('.budget-input')
    await budgetInput.fill('50000')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')

    const filteredRows = await page.locator('tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
  })

  test('warehouse filter updates recommendations', async ({ page }) => {
    const countBefore = await page.locator('tbody tr').count()

    await page.locator('select').nth(1).selectOption('San Francisco')
    await page.waitForLoadState('networkidle')

    const countAfter = await page.locator('tbody tr').count()
    expect(countAfter).not.toBe(countBefore)
  })

  test('clear budget button restores full list', async ({ page }) => {
    const fullCount = await page.locator('tbody tr').count()

    await page.locator('.budget-input').fill('0')
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')

    await page.locator('.clear-budget').click()
    await page.waitForTimeout(600)
    await page.waitForLoadState('networkidle')

    const restoredCount = await page.locator('tbody tr').count()
    expect(restoredCount).toBe(fullCount)
  })
})
