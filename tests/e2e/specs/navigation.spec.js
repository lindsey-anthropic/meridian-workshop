const { test, expect } = require('@playwright/test')

// Critical flow: every primary view is reachable from the nav and renders its
// data without erroring or getting stuck on a loading state.
const VIEWS = [
  { link: 'Overview', url: '/' },
  { link: 'Inventory', url: '/inventory' },
  { link: 'Orders', url: '/orders' },
  { link: 'Finance', url: '/spending' },
  { link: 'Demand Forecast', url: '/demand' },
  { link: 'Reports', url: '/reports' }
]

test.describe('Core navigation', () => {
  test('all nav links are present', async ({ page }) => {
    await page.goto('/')
    for (const { link } of VIEWS) {
      await expect(page.getByRole('link', { name: link })).toBeVisible()
    }
  })

  for (const { link, url } of VIEWS) {
    test(`navigates to ${link} and renders its data`, async ({ page }) => {
      await page.goto('/')
      await page.getByRole('link', { name: link }).click()

      // Routed correctly
      await expect(page).toHaveURL(new RegExp(url.replace('/', '\\/') + '$'))

      // Page header rendered
      await expect(page.getByRole('heading', { level: 2 })).toBeVisible()

      // Data resolved: not stuck loading and no error state
      await expect(page.getByText('Loading...')).toHaveCount(0)
      await expect(page.locator('.error')).toHaveCount(0)
    })
  }
})
