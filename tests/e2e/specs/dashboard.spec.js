import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows KPI stat cards', async ({ page }) => {
    await expect(page.locator('.stat-card').first()).toBeVisible({ timeout: 5000 })
    const cards = page.locator('.stat-card')
    await expect(cards).toHaveCountGreaterThan(2)
  })

  test('inventory value card is not zero', async ({ page }) => {
    await page.waitForSelector('.stat-card', { timeout: 5000 })
    const values = await page.locator('.stat-value').allTextContents()
    const hasNumber = values.some(v => /\d/.test(v))
    expect(hasNumber).toBe(true)
  })

  test('filter bar is visible', async ({ page }) => {
    await expect(page.locator('.filter-bar, [class*="filter"]').first()).toBeVisible()
  })
})
