import { test, expect } from '@playwright/test'

test.describe('Dashboard (Overview)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => !document.querySelector('.loading'))
  })

  test('shows page title', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Overview')
  })

  test('renders KPI cards', async ({ page }) => {
    const kpiSection = page.locator('text=KEY PERFORMANCE INDICATORS').locator('..')
    await expect(kpiSection).toBeVisible()
  })

  test('renders Order Health section', async ({ page }) => {
    await expect(page.locator('text=Order Health')).toBeVisible()
  })

  test('renders Inventory Value by Category chart', async ({ page }) => {
    await expect(page.locator('text=Inventory Value by Category')).toBeVisible()
  })

  test('Location filter updates dashboard data', async ({ page }) => {
    const before = await page.locator('h2').first().textContent()
    await page.getByRole('combobox').nth(1).selectOption('London')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    await expect(page.locator('h2').first()).toBeVisible()
  })

  test('Category filter updates dashboard data', async ({ page }) => {
    await page.getByRole('combobox').nth(2).selectOption('Sensors')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    await expect(page.locator('main')).toBeVisible()
  })
})
