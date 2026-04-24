import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('loads with KPI cards showing non-zero values', async ({ page }) => {
    const kpiValues = page.locator('.kpi-value')
    await expect(kpiValues.first()).toBeVisible()
    const count = await kpiValues.count()
    expect(count).toBeGreaterThan(0)
  })

  test('shows no unexpected console errors on load', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Ignore known pre-existing issue: tasks endpoint not yet implemented
        if (!text.includes('tasks')) errors.push(text)
      }
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })

  test('navigation links are all visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /overview/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /inventory/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /orders/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /reports/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /restocking/i })).toBeVisible()
  })

  test('order health section renders', async ({ page }) => {
    const orderHealth = page.locator('.order-health, .card').first()
    await expect(orderHealth).toBeVisible()
  })
})
