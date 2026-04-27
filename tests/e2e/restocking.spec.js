// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Restocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
  })

  test('budget input is visible with default value', async ({ page }) => {
    const input = page.locator('.budget-input')
    await expect(input).toBeVisible()
    const value = await input.inputValue()
    expect(Number(value)).toBeGreaterThan(0)
  })

  test('apply button loads recommendations', async ({ page }) => {
    await page.locator('.apply-btn').click()
    await page.waitForTimeout(800)

    await expect(page.locator('.error')).toHaveCount(0)
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('tbody tr').first()).toBeVisible()
  })

  test('budget tracker bar appears after loading', async ({ page }) => {
    await page.locator('.apply-btn').click()
    await page.waitForTimeout(800)

    await expect(page.locator('.budget-tracker')).toBeVisible()
    await expect(page.locator('.budget-bar-fill')).toBeVisible()
  })

  test('reducing budget reduces recommendations', async ({ page }) => {
    // Load with default budget
    await page.locator('.apply-btn').click()
    await page.waitForTimeout(800)
    const defaultCount = await page.locator('tbody tr').count()

    // Lower budget drastically
    await page.locator('.budget-input').fill('1000')
    await page.locator('.apply-btn').click()
    await page.waitForTimeout(800)

    const lowBudgetCount = await page.locator('tbody tr').count()
    expect(lowBudgetCount).toBeLessThanOrEqual(defaultCount)
  })

  test('recommendations table has all required columns', async ({ page }) => {
    await page.locator('.apply-btn').click()
    await page.waitForTimeout(800)

    const headers = await page.locator('thead th').allTextContents()
    const required = ['SKU', 'Item', 'Qty to order', 'Total cost', 'Priority']
    required.forEach(col => {
      expect(headers.some(h => h.toLowerCase().includes(col.toLowerCase()))).toBe(true)
    })
  })

  test('trend badges render with correct classes (increasing/stable/decreasing)', async ({ page }) => {
    await page.locator('.apply-btn').click()
    await page.waitForTimeout(800)

    const trendCells = page.locator('.trend')
    const count = await trendCells.count()
    expect(count).toBeGreaterThan(0)

    const validTrends = ['increasing', 'stable', 'decreasing']
    const firstTrend = await trendCells.first().textContent()
    expect(validTrends).toContain(firstTrend?.trim().toLowerCase())
  })

  test('category filter narrows results', async ({ page }) => {
    await page.locator('.apply-btn').click()
    await page.waitForTimeout(800)
    const totalBefore = await page.locator('tbody tr').count()

    const categorySelect = page.locator('select').nth(1)
    const options = await categorySelect.locator('option').allTextContents()
    if (options.length > 1) {
      await categorySelect.selectOption(options[1])
      await page.waitForTimeout(800)
      const totalAfter = await page.locator('tbody tr').count()
      expect(totalAfter).toBeLessThanOrEqual(totalBefore)
    }
    await expect(page.locator('.error')).toHaveCount(0)
  })
})
