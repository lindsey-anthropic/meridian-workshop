import { test, expect } from '@playwright/test'

test.describe('Smoke', () => {
  test('home page loads with branding and primary nav', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { level: 1, name: 'Catalyst Components' })
    ).toBeVisible()

    for (const link of ['Overview', 'Inventory', 'Orders', 'Finance', 'Demand Forecast', 'Reports']) {
      await expect(page.getByRole('link', { name: link })).toBeVisible()
    }
  })

  test('navigates between top-level views', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Inventory' }).click()
    await expect(page).toHaveURL(/\/inventory$/)

    await page.getByRole('link', { name: 'Reports' }).click()
    await expect(page).toHaveURL(/\/reports$/)
    await expect(
      page.getByRole('heading', { level: 2, name: 'Performance Reports' })
    ).toBeVisible()
  })
})
