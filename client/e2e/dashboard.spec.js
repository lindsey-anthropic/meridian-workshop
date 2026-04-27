import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads and shows KPI cards', async ({ page }) => {
    await page.waitForSelector('.kpi-card', { timeout: 10000 })
    await expect(page.locator('.kpi-card')).not.toHaveCount(0)
  })

  test('displays the nav with all sections', async ({ page }) => {
    const nav = page.locator('.nav-tabs')
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: /inventory/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /reports/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /restocking/i })).toBeVisible()
  })

  test('shows company branding in the nav', async ({ page }) => {
    await expect(page.locator('.logo h1')).toBeVisible()
    await expect(page.locator('.logo h1')).not.toBeEmpty()
  })
})
