import { test, expect } from '@playwright/test'

test.describe('Demand Forecast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demand')
    await page.waitForFunction(() => !document.querySelector('.loading'))
  })

  test('shows page title', async ({ page }) => {
    await expect(page.locator('h2')).toBeVisible()
  })

  test('renders trend summary cards', async ({ page }) => {
    await expect(page.locator('text=Increasing Demand').or(page.locator('text=増加傾向'))).toBeVisible()
    await expect(page.locator('text=Stable Demand').or(page.locator('text=安定'))).toBeVisible()
    await expect(page.locator('text=Decreasing Demand').or(page.locator('text=減少傾向'))).toBeVisible()
  })

  test('renders demand forecasts table', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('table has required columns', async ({ page }) => {
    const texts = await page.locator('table thead th').allTextContents()
    const joined = texts.join(' ')
    expect(joined).toMatch(/SKU/i)
    expect(joined).toMatch(/Demand/i)
    expect(joined).toMatch(/Trend/i)
  })

  test('Location filter reduces demand rows', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.getByRole('combobox').nth(1).selectOption('San Francisco')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
  })

  test('Category filter reduces demand rows', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.getByRole('combobox').nth(2).selectOption('Sensors')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
  })

  test('no console errors on load', async ({ page }) => {
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto('/demand')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    expect(errors).toHaveLength(0)
  })
})
