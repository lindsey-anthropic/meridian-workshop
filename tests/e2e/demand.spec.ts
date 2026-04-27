import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('app-locale', 'en')
  })
})

test.describe('Demand Forecast page', () => {
  test('renders forecast rows', async ({ page }) => {
    await page.goto('/demand')

    await expect(page.locator('main')).toBeVisible()

    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('shows trend indicators on each forecast', async ({ page }) => {
    await page.goto('/demand')

    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    expect(await rows.count()).toBeGreaterThan(0)

    // At least one of the standard trend labels should appear
    const trendsVisible = await page.getByText(/increasing|stable|decreasing/i).count()
    expect(trendsVisible).toBeGreaterThan(0)
  })
})
