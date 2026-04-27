import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('app-locale', 'en')
  })
})

test.describe('Inventory page', () => {
  test('renders the stock levels table', async ({ page }) => {
    await page.goto('/inventory')

    await expect(page.getByRole('heading', { name: 'Inventory', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3 }).filter({ hasText: 'Stock Levels' })).toBeVisible()

    const table = page.getByRole('table')
    await expect(table).toBeVisible()
    await expect(table.locator('tbody tr')).not.toHaveCount(0)

    const headerRow = table.locator('thead tr')
    await expect(headerRow).toContainText('SKU')
    await expect(headerRow).toContainText('Item Name')
    await expect(headerRow).toContainText('Category')
    await expect(headerRow).toContainText('Status')
  })

  test('search input narrows the visible rows', async ({ page }) => {
    await page.goto('/inventory')

    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    const initialCount = await rows.count()
    expect(initialCount).toBeGreaterThan(0)

    await page.getByPlaceholder(/Search/i).fill('sensor')

    // Wait for the result set to actually shrink before measuring
    await expect.poll(async () => await rows.count(), { timeout: 5000 }).toBeLessThan(initialCount)

    const filteredCount = await rows.count()
    expect(filteredCount).toBeGreaterThan(0)
  })

  test('warehouse filter scopes the list', async ({ page }) => {
    await page.goto('/inventory')

    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    const initialCount = await rows.count()

    await page.getByLabel('Location').selectOption('Tokyo')
    await expect(rows.first()).toBeVisible()

    const tokyoCount = await rows.count()
    expect(tokyoCount).toBeGreaterThan(0)
    expect(tokyoCount).toBeLessThanOrEqual(initialCount)
  })
})
