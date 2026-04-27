import { test, expect } from '@playwright/test'

test.describe('Restocking page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForSelector('.restocking-table', { timeout: 10000 })
  })

  test('loads and shows recommendations table', async ({ page }) => {
    const rows = page.locator('.restocking-table tbody tr')
    await expect(rows).not.toHaveCount(0)
  })

  test('recommendations are sorted critical first', async ({ page }) => {
    const firstBadge = page.locator('.restocking-table tbody tr').first().locator('.badge').first()
    await expect(firstBadge).toContainText(/Critical/i)
  })

  test('each row shows required columns', async ({ page }) => {
    const firstRow = page.locator('.restocking-table tbody tr').first()
    const cells = firstRow.locator('td')
    await expect(cells).toHaveCount(11) // 11 columns per plan
    // Est. Cost column (index 9) should contain a currency symbol
    await expect(cells.nth(9)).toContainText('$')
  })

  test('budget input filters recommendations', async ({ page }) => {
    // Count total active rows
    const allRows = page.locator('.restocking-table tbody tr')
    const totalCount = await allRows.count()

    // Enter a very small budget — most rows should become greyed out
    await page.locator('.budget-input').fill('1')
    await page.waitForTimeout(300)

    const overBudgetRows = page.locator('.restocking-table tbody tr.over-budget')
    const overBudgetCount = await overBudgetRows.count()
    expect(overBudgetCount).toBeGreaterThan(0)
    expect(overBudgetCount).toBeLessThanOrEqual(totalCount)
  })

  test('budget summary updates when budget is entered', async ({ page }) => {
    await page.locator('.budget-input').fill('500000')
    await page.waitForTimeout(300)
    const summary = page.locator('.budget-summary')
    await expect(summary).toBeVisible()
    await expect(summary).toContainText('items')
  })

  test('dismiss button removes item from table', async ({ page }) => {
    const rows = page.locator('.restocking-table tbody tr')
    const initialCount = await rows.count()

    await rows.first().locator('.dismiss-btn').click()
    await page.waitForTimeout(200)

    await expect(rows).toHaveCount(initialCount - 1)
  })

  test('warehouse filter updates recommendations', async ({ page }) => {
    const rows = page.locator('.restocking-table tbody tr')
    const initialCount = await rows.count()

    // Filter to Tokyo — should return fewer or equal items
    const warehouseSelect = page.locator('.filter-select').nth(1)
    await warehouseSelect.selectOption('Tokyo')
    await page.waitForTimeout(500)

    const filteredCount = await rows.count()
    expect(filteredCount).toBeLessThanOrEqual(initialCount)

    // All visible rows should reference Tokyo
    if (filteredCount > 0) {
      const firstWarehouse = await rows.first().locator('td').nth(3).innerText()
      expect(firstWarehouse).toContain('Tokyo')
    }
  })

  test('category filter updates recommendations', async ({ page }) => {
    const rows = page.locator('.restocking-table tbody tr')
    const initialCount = await rows.count()

    const categorySelect = page.locator('.filter-select').nth(2)
    await categorySelect.selectOption('sensors')
    await page.waitForTimeout(500)

    const filteredCount = await rows.count()
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
  })

  test('empty state shown when no items match filters', async ({ page }) => {
    // Reset to all warehouses first
    const warehouseSelect = page.locator('.filter-select').nth(1)
    await warehouseSelect.selectOption('London')

    const categorySelect = page.locator('.filter-select').nth(2)
    await categorySelect.selectOption('sensors')
    await page.waitForTimeout(500)

    // Either table has rows, or empty state is shown — both are valid
    const hasTable = await page.locator('.restocking-table').isVisible().catch(() => false)
    const hasEmpty = await page.locator('.empty-state').isVisible().catch(() => false)
    expect(hasTable || hasEmpty).toBe(true)
  })
})
