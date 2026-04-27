import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('all tabs load without error', async ({ page }) => {
    const routes = [
      { path: '/', heading: 'Overview' },
      { path: '/inventory', heading: 'Inventory' },
      { path: '/orders', heading: 'Orders' },
      { path: '/spending', heading: 'Finance Dashboard' },
      { path: '/demand', heading: 'Demand Forecast' },
      { path: '/reports', heading: 'Performance Reports' },
    ]

    for (const { path, heading } of routes) {
      await page.goto(path)
      await expect(page.getByRole('heading', { name: heading, level: 2 })).toBeVisible()
    }
  })

  test('filter bar is visible on all pages', async ({ page }) => {
    const routes = ['/', '/inventory', '/orders', '/reports']
    for (const path of routes) {
      await page.goto(path)
      await expect(page.getByRole('combobox').first()).toBeVisible()
    }
  })

  test('active nav tab is highlighted for current route', async ({ page }) => {
    await page.goto('/inventory')
    const inventoryLink = page.getByRole('link', { name: 'Inventory' })
    await expect(inventoryLink).toHaveClass(/active/)
  })
})
