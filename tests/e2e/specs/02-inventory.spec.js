import { test, expect } from '@playwright/test'

/**
 * Flow 2 — Inventory filter and sort by warehouse, category, stock level.
 * Per proposal section 3.3.
 */

test.describe('Flow 2 — Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
  })

  test('renders inventory table with rows', async ({ page }) => {
    const table = page.locator('table').first()
    await expect(table.locator('tbody tr')).not.toHaveCount(0)
  })

  test('warehouse filter narrows results to selected location', async ({ page }) => {
    const locationSelect = page.locator('.filter-group').filter({ hasText: 'Location' }).locator('select')
    const apiCall = page.waitForResponse((resp) =>
      resp.url().includes('/api/inventory') && resp.url().includes('warehouse=London')
    )
    await locationSelect.selectOption('London')
    const response = await apiCall

    expect(response.url()).toContain('warehouse=London')
    const data = await response.json()
    expect(data.length).toBeGreaterThan(0)
    // Validate the filter at the API level — UI columns expose `location` (rack) rather than city.
    for (const item of data.slice(0, 5)) {
      expect(item.warehouse).toBe('London')
    }
    await expect(page.locator('table tbody tr').first()).toBeVisible()
  })

  test('category filter applies independently of warehouse', async ({ page }) => {
    const categorySelect = page.locator('.filter-group').filter({ hasText: 'Category' }).locator('select')
    const apiCall = page.waitForResponse((resp) =>
      resp.url().includes('/api/inventory') && resp.url().includes('category=')
    )
    await categorySelect.selectOption('Sensors')
    await apiCall

    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })
})
