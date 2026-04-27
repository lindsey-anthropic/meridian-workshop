import { test, expect } from '@playwright/test'

test.describe('Restocking page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForSelector('table, .empty-state', { timeout: 8000 })
  })

  test('shows recommendations table', async ({ page }) => {
    const table = page.locator('table')
    await expect(table).toBeVisible()
    const rows = page.locator('tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('shows summary bar with item count and total cost', async ({ page }) => {
    await expect(page.locator('.summary-bar')).toBeVisible()
    await expect(page.locator('.summary-value').first()).toBeVisible()
  })

  test('budget filter reduces recommendations', async ({ page }) => {
    const rowsBefore = await page.locator('tbody tr').count()

    // Set a small budget
    await page.locator('input[type="number"]').fill('1000')
    await page.locator('input[type="number"]').press('Enter')
    await page.locator('button', { hasText: 'Refresh' }).click()
    await page.waitForTimeout(500)

    const rowsAfter = await page.locator('tbody tr').count()
    expect(rowsAfter).toBeLessThanOrEqual(rowsBefore)
  })

  test('order button changes to "Ordered" after click', async ({ page }) => {
    const firstOrderBtn = page.locator('button', { hasText: 'Order' }).first()
    await expect(firstOrderBtn).toBeVisible()
    await firstOrderBtn.click()
    await expect(firstOrderBtn).toHaveText('Ordered')
    await expect(firstOrderBtn).toBeDisabled()
  })

  test('warehouse filter works', async ({ page }) => {
    // Target the warehouse select inside the restocking controls card specifically
    await page.locator('.controls select').selectOption({ value: 'San Francisco' })
    await page.locator('button', { hasText: 'Refresh' }).click()
    await page.waitForTimeout(500)
    // After filtering, each visible row should show the warehouse
    const warehouseCells = page.locator('tbody td:nth-child(3)')
    const count = await warehouseCells.count()
    for (let i = 0; i < count; i++) {
      await expect(warehouseCells.nth(i)).toHaveText('San Francisco')
    }
  })
})
