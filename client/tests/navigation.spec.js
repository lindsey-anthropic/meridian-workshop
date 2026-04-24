import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('app loads and shows company name', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Catalyst Components' })).toBeVisible()
    await expect(page.getByText('Inventory Management System')).toBeVisible()
  })

  const navLinks = [
    { label: 'Overview', url: '/' },
    { label: 'Inventory', url: '/inventory' },
    { label: 'Orders', url: '/orders' },
    { label: 'Finance', url: '/spending' },
    { label: 'Demand Forecast', url: '/demand' },
    { label: 'Reports', url: '/reports' },
    { label: 'Restock', url: '/restock' },
  ]

  for (const { label, url } of navLinks) {
    test(`navigates to ${label}`, async ({ page }) => {
      await page.goto('/')
      await page.getByRole('link', { name: label }).click()
      await expect(page).toHaveURL(url)
    })
  }

  test('filter bar dropdowns are present on every page', async ({ page }) => {
    for (const { url } of navLinks) {
      await page.goto(url)
      // Filter bar always has at least 2 comboboxes (Location, Category)
      const combos = page.getByRole('combobox')
      await expect(combos.first()).toBeVisible()
    }
  })
})
