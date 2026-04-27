// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await expect(page.locator('.loading')).toHaveCount(0, { timeout: 8000 })
  })

  test('quarterly performance table is populated', async ({ page }) => {
    const rows = page.locator('table').first().locator('tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('monthly bar chart renders bars', async ({ page }) => {
    await expect(page.locator('.bar-chart')).toBeVisible()
    await expect(page.locator('.bar').first()).toBeVisible()
  })

  test('month-over-month table shows data', async ({ page }) => {
    const tables = page.locator('table')
    const count = await tables.count()
    expect(count).toBeGreaterThan(1)
    await expect(tables.nth(1).locator('tbody tr').first()).toBeVisible()
  })

  test('summary stat cards are visible', async ({ page }) => {
    const statCards = page.locator('.stat-card')
    await expect(statCards.first()).toBeVisible()
  })

  test('warehouse filter updates data without error (R1 fix)', async ({ page }) => {
    const warehouseSelect = page.locator('select').first()
    const options = await warehouseSelect.locator('option').allTextContents()
    if (options.length > 1) {
      await warehouseSelect.selectOption(options[1])
      await page.waitForTimeout(800)
      await expect(page.locator('.error')).toHaveCount(0)
      await expect(page.locator('table').first().locator('tbody')).toBeVisible()
    }
  })

  test('no console errors on load', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.reload()
    await expect(page.locator('.loading')).toHaveCount(0, { timeout: 8000 })
    expect(errors).toHaveLength(0)
  })
})
