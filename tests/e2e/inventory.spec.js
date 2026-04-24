import { test, expect } from '@playwright/test'

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await page.waitForSelector('table')
  })

  test('loads inventory table with items', async ({ page }) => {
    const count = await page.locator('tbody tr').count()
    expect(count).toBeGreaterThan(0)
  })

  test('filters by warehouse', async ({ page }) => {
    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('London')
    await page.waitForTimeout(500)

    const heading = page.locator('h3')
    await expect(heading).toContainText('11 SKUs')
  })

  test('filters by category', async ({ page }) => {
    const categorySelect = page.locator('select').nth(2)
    await categorySelect.selectOption('Sensors')
    await page.waitForTimeout(500)

    const categoryCells = page.locator('tbody td:nth-child(3)')
    for (const cell of await categoryCells.all()) {
      await expect(cell).toHaveText('Sensors')
    }
  })

  test('shows low stock badge for items below reorder point', async ({ page }) => {
    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('London')
    await page.waitForTimeout(500)

    const tmpRow = page.locator('tbody tr', { hasText: 'TMP-201' })
    await expect(tmpRow).toContainText('Low Stock')
  })

  test('reset filters restores full list', async ({ page }) => {
    const allRows = await page.locator('tbody tr').count()

    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('London')
    await page.waitForTimeout(500)
    const filteredCount = await page.locator('tbody tr').count()
    expect(filteredCount).toBeLessThan(allRows)

    await page.getByRole('button', { name: /reset/i }).click()
    await page.waitForTimeout(500)
    const resetCount = await page.locator('tbody tr').count()
    expect(resetCount).toBe(allRows)
  })
})
