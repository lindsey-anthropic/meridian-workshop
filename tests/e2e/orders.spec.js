// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Orders', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/orders')
  })

  test('renders orders table', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('tbody tr').first()).toBeVisible()
  })

  test('status filter works', async ({ page }) => {
    const allCount = await page.locator('tbody tr').count()

    // Select a specific status (second option after "all")
    const statusSelect = page.locator('select').filter({ hasText: /all/i }).first()
    const options = await statusSelect.locator('option').allTextContents()
    if (options.length > 1) {
      await statusSelect.selectOption(options[1])
      await page.waitForTimeout(500)
      const filteredCount = await page.locator('tbody tr').count()
      expect(filteredCount).toBeLessThanOrEqual(allCount)
    }
    await expect(page.locator('.error')).toHaveCount(0)
  })

  test('order rows show status badges', async ({ page }) => {
    const badges = page.locator('tbody .badge')
    await expect(badges.first()).toBeVisible()
  })
})
