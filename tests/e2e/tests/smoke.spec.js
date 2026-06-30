// Baseline smoke coverage of the main operator path (R3).
// Gives IT regression confidence that the core navigation and views still render.
const { test, expect } = require('@playwright/test')

test.describe('Operator path smoke', () => {
  test('app shell renders with the primary navigation', async ({ page }) => {
    await page.goto('/')
    for (const link of [
      'Overview', 'Inventory', 'Orders', 'Finance', 'Demand Forecast', 'Reports', 'Restocking',
    ]) {
      await expect(page.getByRole('link', { name: link, exact: true })).toBeVisible()
    }
  })

  test('navigating the core views loads each page and the filter bar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Overview', level: 2 })).toBeVisible()

    const steps = [
      { link: 'Inventory', url: /\/inventory$/ },
      { link: 'Orders', url: /\/orders$/ },
      { link: 'Finance', url: /\/spending$/ },
      { link: 'Demand Forecast', url: /\/demand$/ },
      { link: 'Reports', url: /\/reports$/ },
      { link: 'Restocking', url: /\/restocking$/ },
    ]

    for (const step of steps) {
      await page.getByRole('link', { name: step.link, exact: true }).click()
      await expect(page).toHaveURL(step.url)
      // Each view renders a page-level heading...
      await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible()
      // ...and the shared filter bar is present across the operator path.
      await expect(page.locator('select').first()).toBeVisible()
    }
  })
})
