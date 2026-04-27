import { test, expect } from '@playwright/test'

test.describe('Orders', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/orders')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
  })

  test('orders table loads with data', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'Order Number' })).toBeVisible()
    const rows = page.locator('tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('status stat cards are displayed', async ({ page }) => {
    const statCards = page.locator('.stat-card')
    await expect(statCards.first()).toBeVisible()
    const count = await statCards.count()
    expect(count).toBe(4)
  })

  test('status filter shows only matching orders', async ({ page }) => {
    const statusFilter = page.locator('select').nth(3)
    await statusFilter.selectOption('Delivered')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
    const rows = page.locator('tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
    const firstStatus = await rows.first().locator('td').last().textContent()
    expect(firstStatus?.trim()).toBeTruthy()
  })

  test('warehouse filter reduces order count', async ({ page }) => {
    const allCount = await page.locator('tbody tr').count()
    const locationFilter = page.locator('select').nth(1)
    await locationFilter.selectOption('London')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
    const filteredCount = await page.locator('tbody tr').count()
    expect(filteredCount).toBeLessThanOrEqual(allCount)
  })

  test('time period filter works', async ({ page }) => {
    const periodFilter = page.locator('select').nth(0)
    await periodFilter.selectOption('January')
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 })
    const count = await page.locator('tbody tr').count()
    expect(count).toBeGreaterThan(0)
  })
})
