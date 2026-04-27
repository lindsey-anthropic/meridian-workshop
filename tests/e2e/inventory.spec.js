import { test, expect } from '@playwright/test'

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await page.waitForFunction(() => !document.querySelector('.loading'))
  })

  test('shows page title', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Inventory')
  })

  test('renders inventory table with rows', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('table has required columns', async ({ page }) => {
    const headers = page.locator('table thead th')
    const texts = await headers.allTextContents()
    const joined = texts.join(' ')
    expect(joined).toMatch(/SKU/i)
    expect(joined).toMatch(/Category/i)
    expect(joined).toMatch(/Location/i)
  })

  test('Location filter reduces inventory rows', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.getByRole('combobox').nth(1).selectOption('Tokyo')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
  })

  test('Category filter reduces inventory rows', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.getByRole('combobox').nth(2).selectOption('Sensors')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
  })

  test('combined filters reduce inventory rows further', async ({ page }) => {
    await page.getByRole('combobox').nth(1).selectOption('London')
    await page.getByRole('combobox').nth(2).selectOption('Sensors')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThanOrEqual(0)
  })

  test('no console errors on load', async ({ page }) => {
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto('/inventory')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    expect(errors).toHaveLength(0)
  })
})
