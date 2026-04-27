// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.loading')).toHaveCount(0, { timeout: 8000 })
  })

  test('loads KPI cards', async ({ page }) => {
    await expect(page.locator('.kpi-card').first()).toBeVisible()
    const values = await page.locator('.kpi-value').allTextContents()
    expect(values.length).toBeGreaterThan(0)
    values.forEach(v => expect(v.trim()).not.toBe(''))
  })

  test('nav links are visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Inventory' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Restocking' })).toBeVisible()
  })

  test('filter bar is present', async ({ page }) => {
    await expect(page.locator('.filter-bar, .filters, select').first()).toBeVisible()
    await expect(page.locator('.error')).toHaveCount(0)
  })
})
