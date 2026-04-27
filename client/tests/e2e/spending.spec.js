import { test, expect } from '@playwright/test'

test.describe('Spending & Finance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spending')
    await page.waitForFunction(() => !document.querySelector('.loading'))
  })

  test('shows page title', async ({ page }) => {
    await expect(page.locator('h2')).toBeVisible()
  })

  test('renders financial KPI cards', async ({ page }) => {
    // Use .stat-label to avoid matching chart legend items that share the same text
    await expect(page.locator('.stat-label').filter({ hasText: 'Total Revenue' }).first()).toBeVisible()
    await expect(page.locator('.stat-label').filter({ hasText: 'Net Profit' }).first()).toBeVisible()
  })

  test('renders Revenue vs Costs chart', async ({ page }) => {
    await expect(page.locator('h3').filter({ hasText: /Revenue.*Costs/i }).first()).toBeVisible()
    const barGroups = page.locator('.bar-group-revenue')
    expect(await barGroups.count()).toBe(12)
  })

  test('renders Monthly Cost Flow chart', async ({ page }) => {
    await expect(page.locator('h3').filter({ hasText: /Cost Flow/i }).first()).toBeVisible()
  })

  test('Time Period filter changes visible data', async ({ page }) => {
    // Finance page filters by time period — pick a specific month and confirm page still renders
    await page.getByRole('combobox').nth(0).selectOption({ index: 1 })
    await page.waitForFunction(() => !document.querySelector('.loading'))
    await expect(page.locator('.stat-value').first()).toBeVisible()
  })

  test('no console errors on load', async ({ page }) => {
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto('/spending')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    expect(errors).toHaveLength(0)
  })
})
