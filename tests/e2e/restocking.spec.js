import { test, expect } from '@playwright/test'

test.describe('Restocking page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    // Wait for recommendations table to load
    await expect(page.locator('table tbody tr').first()).toBeVisible()
  })

  test('shows the page heading and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible()
    await expect(page.getByText('Purchase order recommendations based on stock levels and demand forecast')).toBeVisible()
  })

  test('shows budget input with Apply button', async ({ page }) => {
    await expect(page.getByRole('spinbutton')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible()
  })

  test('displays summary stats: items, total cost, critical count', async ({ page }) => {
    await expect(page.getByText('Items to Restock')).toBeVisible()
    await expect(page.getByText('Total Est. Cost')).toBeVisible()
    await expect(page.getByText('Critical')).toBeVisible()
  })

  test('table shows expected columns', async ({ page }) => {
    const headers = page.locator('table thead th')
    await expect(headers.filter({ hasText: 'Urgency' })).toBeVisible()
    await expect(headers.filter({ hasText: 'SKU' })).toBeVisible()
    await expect(headers.filter({ hasText: 'Current Stock' })).toBeVisible()
    await expect(headers.filter({ hasText: 'Reorder Point' })).toBeVisible()
    await expect(headers.filter({ hasText: 'Recommended Qty' })).toBeVisible()
    await expect(headers.filter({ hasText: 'Est. Cost' })).toBeVisible()
  })

  test('all recommendations are at or below their reorder point', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td')
      const stock = parseInt((await cells.nth(4).textContent()).replace(/,/g, ''))
      const reorder = parseInt((await cells.nth(5).textContent()).replace(/,/g, ''))
      expect(stock).toBeLessThanOrEqual(reorder)
    }
  })

  test('budget ceiling filters recommendations', async ({ page }) => {
    const allCount = await page.locator('table tbody tr').count()

    // Apply a tight budget — should return fewer items
    await page.getByRole('spinbutton').fill('25000')
    await page.getByRole('button', { name: 'Apply' }).click()
    await page.waitForTimeout(500)

    const budgetedCount = await page.locator('table tbody tr').count()
    expect(budgetedCount).toBeLessThanOrEqual(allCount)

    // Budget active pill should appear
    await expect(page.getByText(/Budget: \$25,000/)).toBeVisible()

    // Clear button should appear
    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible()
  })

  test('clearing budget restores full recommendations', async ({ page }) => {
    const allCount = await page.locator('table tbody tr').count()

    await page.getByRole('spinbutton').fill('1000')
    await page.getByRole('button', { name: 'Apply' }).click()
    await page.waitForTimeout(500)

    await page.getByRole('button', { name: 'Clear' }).click()
    await page.waitForTimeout(500)

    const restoredCount = await page.locator('table tbody tr').count()
    expect(restoredCount).toBe(allCount)
  })

  test('warehouse filter scopes recommendations to that warehouse', async ({ page }) => {
    // Filter to Tokyo — all results should be Tokyo
    await page.locator('.filter-select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(500)

    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await expect(rows.nth(i).locator('td').nth(3)).toContainText('Tokyo')
      }
    }
  })

  test('category filter scopes recommendations to that category', async ({ page }) => {
    await page.locator('.filter-select').nth(2).selectOption('Sensors')
    await page.waitForTimeout(500)

    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    // Either results are all Sensors, or no results (empty state)
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await expect(rows.nth(i).locator('td').nth(2)).toContainText('Sensor')
      }
    } else {
      await expect(page.getByText('No restocking needed')).toBeVisible()
    }
  })

  test('Restocking nav link is active when on restocking page', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Restocking' })
    await expect(link).toHaveClass(/active/)
  })
})
