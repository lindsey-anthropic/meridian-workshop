import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('renders nav bar with all links', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav.nav-tabs')
    await expect(nav.locator('a[href="/"]')).toBeVisible()
    await expect(nav.locator('a[href="/inventory"]')).toBeVisible()
    await expect(nav.locator('a[href="/orders"]')).toBeVisible()
    await expect(nav.locator('a[href="/spending"]')).toBeVisible()
    await expect(nav.locator('a[href="/demand"]')).toBeVisible()
    await expect(nav.locator('a[href="/reports"]')).toBeVisible()
    await expect(nav.locator('a[href="/restocking"]')).toBeVisible()
  })

  test('navigates to each view without errors', async ({ page }) => {
    const routes = ['/', '/inventory', '/orders', '/spending', '/demand', '/reports', '/restocking']
    for (const route of routes) {
      await page.goto(route)
      await expect(page.locator('main')).toBeVisible()
      const errors = []
      page.on('pageerror', e => errors.push(e.message))
      expect(errors).toHaveLength(0)
    }
  })

  test('active link is highlighted for current route', async ({ page }) => {
    await page.goto('/inventory')
    const activeLink = page.locator('nav.nav-tabs a.active')
    await expect(activeLink).toHaveAttribute('href', '/inventory')
  })
})
