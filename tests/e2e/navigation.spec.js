const { test, expect } = require('@playwright/test')

test.describe('Navigation', () => {
  test('homepage loads with correct branding', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Catalyst Components')
    await expect(page).toHaveTitle('Factory Inventory Management System')
  })

  test('all nav links are visible', async ({ page }) => {
    await page.goto('/')
    const links = ['Overview', 'Inventory', 'Orders', 'Finance', 'Demand Forecast', 'Reports', 'Restocking']
    for (const name of links) {
      await expect(page.getByRole('link', { name })).toBeVisible()
    }
  })

  test('Reports link navigates to /reports', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Reports' }).click()
    await expect(page).toHaveURL('/reports')
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
  })

  test('Restocking link navigates to /restocking', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Restocking' }).click()
    await expect(page).toHaveURL('/restocking')
    await expect(page.getByRole('heading', { name: 'Restocking' })).toBeVisible()
  })

  test('language switcher is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: /English/i })).toBeVisible()
  })
})
