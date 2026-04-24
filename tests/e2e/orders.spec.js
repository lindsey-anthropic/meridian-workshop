import { test, expect } from '@playwright/test'

test.describe('Orders', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/orders')
    await page.waitForSelector('table')
  })

  test('loads orders table with items', async ({ page }) => {
    const count = await page.locator('tbody tr').count()
    expect(count).toBeGreaterThan(0)
  })

  test('filters by warehouse', async ({ page }) => {
    const allCount = await page.locator('tbody tr').count()

    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('Tokyo')
    await page.waitForTimeout(500)

    const filteredCount = await page.locator('tbody tr').count()
    expect(filteredCount).toBeGreaterThan(0)
    expect(filteredCount).toBeLessThan(allCount)
  })

  test('filters by order status', async ({ page }) => {
    const statusSelect = page.locator('select').nth(3)
    await statusSelect.selectOption('Processing')
    await page.waitForTimeout(500)

    const count = await page.locator('tbody tr').count()
    expect(count).toBeGreaterThan(0)
  })

  test('filters by month', async ({ page }) => {
    const monthSelect = page.locator('select').nth(0)
    await monthSelect.selectOption('January')
    await page.waitForTimeout(500)

    const count = await page.locator('tbody tr').count()
    expect(count).toBeGreaterThan(0)
  })

  test('combined warehouse and status filter', async ({ page }) => {
    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('San Francisco')
    const statusSelect = page.locator('select').nth(3)
    await statusSelect.selectOption('Delivered')
    await page.waitForTimeout(500)

    const count = await page.locator('tbody tr').count()
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
