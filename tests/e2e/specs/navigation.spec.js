import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('app loads and shows company name', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.logo h1')).toBeVisible()
  })

  test('all nav links are present', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('.nav-tabs')
    await expect(nav.getByRole('link', { name: /inventory/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /orders/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /reports/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /restocking/i })).toBeVisible()
  })

  test('navigating to Inventory works', async ({ page }) => {
    await page.goto('/')
    await page.click('.nav-tabs a[href="/inventory"]')
    await expect(page).toHaveURL('/inventory')
    await expect(page.locator('h2')).toBeVisible()
  })

  test('navigating to Orders works', async ({ page }) => {
    await page.goto('/orders')
    await expect(page.locator('h2')).toBeVisible()
    await expect(page.locator('table')).toBeVisible()
  })

  test('navigating to Reports works', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.locator('h2')).toContainText(/reports/i)
  })

  test('navigating to Restocking works', async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.locator('h2')).toContainText(/restocking/i)
  })
})
