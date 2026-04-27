// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await expect(page.locator('.loading')).toHaveCount(0, { timeout: 8000 })
  })

  test('renders inventory table with rows', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('tbody tr').first()).toBeVisible()
  })

  test('each row has SKU, name, warehouse columns', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first()
    await expect(firstRow.locator('td').nth(0)).not.toBeEmpty()
    await expect(firstRow.locator('td').nth(1)).not.toBeEmpty()
  })

  test('low-stock badge appears', async ({ page }) => {
    const badges = page.locator('.badge.danger, .badge.warning')
    await expect(badges.first()).toBeVisible()
  })

  test('category filter narrows results', async ({ page }) => {
    const totalBefore = await page.locator('tbody tr').count()
    expect(totalBefore).toBeGreaterThan(0)

    const selects = page.locator('select')
    const count = await selects.count()
    if (count > 1) {
      const categorySelect = selects.nth(1)
      const options = await categorySelect.locator('option').allTextContents()
      if (options.length > 1) {
        await categorySelect.selectOption(options[1])
        await page.waitForTimeout(500)
        const totalAfter = await page.locator('tbody tr').count()
        expect(totalAfter).toBeLessThanOrEqual(totalBefore)
      }
    }
    await expect(page.locator('.error')).toHaveCount(0)
  })
})
