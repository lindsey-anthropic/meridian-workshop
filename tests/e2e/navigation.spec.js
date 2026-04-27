import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('loads the dashboard on root path', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Meridian|Inventory|Factory/i)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('navigates to all main sections', async ({ page }) => {
    await page.goto('/')
    const navLinks = [
      { label: /inventory/i, path: '/inventory' },
      { label: /orders/i,    path: '/orders' },
      { label: /reports/i,   path: '/reports' },
      { label: /restocking/i, path: '/restocking' }
    ]

    for (const { label, path } of navLinks) {
      await page.getByRole('link', { name: label }).click()
      await expect(page).toHaveURL(new RegExp(path))
      await expect(page.locator('h2')).toBeVisible()
    }
  })
})
