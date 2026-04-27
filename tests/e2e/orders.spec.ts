import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('app-locale', 'en')
  })
})

test.describe('Orders page', () => {
  test('renders the orders list', async ({ page }) => {
    await page.goto('/orders')

    await expect(page.getByRole('heading', { name: 'Orders', exact: true })).toBeVisible()

    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('status filter narrows the order list', async ({ page }) => {
    await page.goto('/orders')

    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    const initialCount = await rows.count()

    await page.getByLabel('Order Status').selectOption('delivered')
    await expect(rows.first()).toBeVisible()

    const deliveredCount = await rows.count()
    expect(deliveredCount).toBeGreaterThan(0)
    expect(deliveredCount).toBeLessThanOrEqual(initialCount)
  })

  test('warehouse filter scopes the order list', async ({ page }) => {
    await page.goto('/orders')

    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    const initialCount = await rows.count()

    await page.getByLabel('Location').selectOption('Tokyo')
    await expect(rows.first()).toBeVisible()

    const tokyoCount = await rows.count()
    expect(tokyoCount).toBeGreaterThan(0)
    expect(tokyoCount).toBeLessThanOrEqual(initialCount)
  })
})
