import { test, expect } from '@playwright/test'

test.describe('Restocking Recommendations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForFunction(() => !document.querySelector('.loading'))
  })

  test('shows page title', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Restocking Recommendations')
  })

  test('renders budget input and Apply button', async ({ page }) => {
    await expect(page.locator('input[type="number"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /apply/i })).toBeVisible()
  })

  test('renders summary stat cards', async ({ page }) => {
    await expect(page.locator('text=Items at Risk')).toBeVisible()
    await expect(page.locator('text=Total Restock Cost')).toBeVisible()
    await expect(page.locator('text=Within Budget')).toBeVisible()
    await expect(page.locator('text=Budget Remaining')).toBeVisible()
  })

  test('renders recommendations table', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('table has required columns', async ({ page }) => {
    const texts = await page.locator('table thead th').allTextContents()
    const joined = texts.join(' ')
    expect(joined).toMatch(/SKU/i)
    expect(joined).toMatch(/Gap/i)
    expect(joined).toMatch(/Restock Cost/i)
    expect(joined).toMatch(/Demand Trend/i)
  })

  test('budget ceiling shows Status column and marks items', async ({ page }) => {
    await page.locator('input[type="number"]').fill('5000')
    await page.getByRole('button', { name: /apply/i }).click()
    await page.waitForFunction(() => !document.querySelector('.loading'))
    // Status column should appear
    const texts = await page.locator('table thead th').allTextContents()
    expect(texts.join(' ')).toMatch(/Status/i)
    // At least one "Within Budget" badge
    await expect(page.locator('text=Within Budget').first()).toBeVisible()
  })

  test('budget of 0 hides Status column', async ({ page }) => {
    await page.locator('input[type="number"]').fill('0')
    await page.getByRole('button', { name: /apply/i }).click()
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const texts = await page.locator('table thead th').allTextContents()
    expect(texts.join(' ')).not.toMatch(/Status/i)
  })

  test('Location filter reloads recommendations', async ({ page }) => {
    const allCount = await page.locator('table tbody tr').count()
    await page.getByRole('combobox').nth(1).selectOption('San Francisco')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    const filteredCount = await page.locator('table tbody tr').count()
    expect(filteredCount).toBeLessThanOrEqual(allCount)
  })

  test('empty state shown when no items at risk for filter', async ({ page }) => {
    // Circuit Boards at SF may have no understocked items
    await page.getByRole('combobox').nth(1).selectOption('San Francisco')
    await page.getByRole('combobox').nth(2).selectOption('Circuit Boards')
    await page.waitForFunction(() => !document.querySelector('.loading'))
    // Either a table with rows OR a no-items message
    const rowCount = await page.locator('table tbody tr').count()
    const noItems = await page.locator('text=No understocked items').count()
    expect(rowCount + noItems).toBeGreaterThan(0)
  })
})
