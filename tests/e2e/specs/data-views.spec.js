const { test, expect } = require('@playwright/test')

const locationFilter = (page) =>
  page.locator('select').filter({ has: page.locator('option', { hasText: 'San Francisco' }) })

test.describe('Data views', () => {
  test('Orders renders rows and filtering narrows them', async ({ page }) => {
    await page.goto('/orders')

    const rows = page.locator('.orders-table tbody tr')
    await expect(rows.first()).toBeVisible()
    const allCount = await rows.count()
    expect(allCount).toBeGreaterThan(0)

    // Filtering by warehouse narrows the result set
    await locationFilter(page).selectOption('Tokyo')
    await expect(rows).not.toHaveCount(allCount)

    const tokyoCount = await rows.count()
    expect(tokyoCount).toBeGreaterThan(0)
    expect(tokyoCount).toBeLessThan(allCount)
  })

  test('Inventory loads its stock table', async ({ page }) => {
    await page.goto('/inventory')
    await expect(page.getByRole('heading', { name: 'Inventory', level: 2 })).toBeVisible()
    // Stock Levels card renders a populated table of SKUs
    await expect(page.getByText(/Stock Levels/)).toBeVisible()
    await expect(page.locator('table tbody tr').first()).toBeVisible()
    await expect(page.locator('.error')).toHaveCount(0)
  })

  test('Finance and Demand views resolve without errors', async ({ page }) => {
    await page.goto('/spending')
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
    await expect(page.getByText('Loading...')).toHaveCount(0)
    await expect(page.locator('.error')).toHaveCount(0)

    await page.goto('/demand')
    await expect(page.getByRole('heading', { name: 'Demand Forecast', level: 2 })).toBeVisible()
    await expect(page.getByText('Loading...')).toHaveCount(0)
    await expect(page.locator('.error')).toHaveCount(0)
  })
})
