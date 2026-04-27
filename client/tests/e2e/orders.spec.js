import { test, expect } from '@playwright/test'

test.describe('Orders', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/orders')
    await page.waitForFunction(() => !document.querySelector('.loading'))
  })

  test('shows page title', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Orders')
  })

  test('renders orders table with rows', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('table has required columns', async ({ page }) => {
    const texts = await page.locator('table thead th').allTextContents()
    const joined = texts.join(' ')
    expect(joined).toMatch(/Order/i)
    expect(joined).toMatch(/Status/i)
    expect(joined).toMatch(/Customer/i)
  })

  test('Order Status filter works', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.getByRole('combobox').nth(3).selectOption('Delivered')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const filtered = await page.locator('table tbody tr').count()
    expect(filtered).toBeLessThanOrEqual(allRows)
    // All visible status badges should say Delivered
    const badges = page.locator('table tbody tr td:last-child span')
    const statuses = await badges.allTextContents()
    for (const s of statuses) {
      expect(s.toLowerCase()).toContain('delivered')
    }
  })

  test('Location filter works', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.getByRole('combobox').nth(1).selectOption('San Francisco')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const filtered = await page.locator('table tbody tr').count()
    expect(filtered).toBeLessThanOrEqual(allRows)
  })

  test('Time Period filter works', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.getByRole('combobox').nth(0).selectOption('January')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const filtered = await page.locator('table tbody tr').count()
    expect(filtered).toBeLessThanOrEqual(allRows)
  })
})
