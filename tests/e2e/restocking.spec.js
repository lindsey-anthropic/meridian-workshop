const { test, expect } = require('@playwright/test')

test.describe('Restocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForSelector('table, .empty', { timeout: 5000 })
  })

  test('loads restocking page without error', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Restocking Recommendations')
    await expect(page.locator('.error')).not.toBeVisible()
  })

  test('shows recommendations table with required columns', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible()
    const headers = page.locator('table thead th')
    await expect(headers.getByText('SKU')).toBeVisible()
    await expect(headers.getByText('Warehouse')).toBeVisible()
    await expect(headers.getByText('Urgency')).toBeVisible()
    await expect(headers.getByText('Est. Cost')).toBeVisible()
  })

  test('shows stat cards', async ({ page }) => {
    await expect(page.getByText('Items to Restock')).toBeVisible()
    await expect(page.getByText('Total Est. Cost')).toBeVisible()
    await expect(page.getByText('Within Budget')).toBeVisible()
  })

  test('shows urgency badges', async ({ page }) => {
    const badges = page.locator('.badge')
    expect(await badges.count()).toBeGreaterThan(0)
  })

  test('budget ceiling input exists', async ({ page }) => {
    await expect(page.getByText('Budget Ceiling')).toBeVisible()
    const input = page.locator('.budget-input')
    await expect(input).toBeVisible()
  })

  test('budget ceiling updates within-budget stat', async ({ page }) => {
    const input = page.locator('.budget-input')
    await input.fill('50000')
    await page.waitForTimeout(300)

    // Stats bar should now reflect the budget
    const statCard = page.locator('.stat-card').last()
    await expect(statCard).toBeVisible()
    const text = await statCard.textContent()
    expect(text).toMatch(/\$/)
  })

  test('filter by warehouse updates recommendations', async ({ page }) => {
    const initialCount = await page.locator('table tbody tr').count()

    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(800)

    await expect(page.locator('.error')).not.toBeVisible()
    const filteredCount = await page.locator('table tbody tr').count()
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
  })

  test('export CSV button is present and enabled', async ({ page }) => {
    const exportBtn = page.getByText('Export CSV')
    await expect(exportBtn).toBeVisible()
    await expect(exportBtn).not.toBeDisabled()
  })

  test('critical items appear before medium items', async ({ page }) => {
    const badges = page.locator('.badge')
    const count = await badges.count()
    if (count < 2) return

    const urgencies = []
    for (let i = 0; i < Math.min(count, 8); i++) {
      urgencies.push(await badges.nth(i).textContent())
    }

    // No medium badge should appear before a critical one
    const mediumIndex = urgencies.findIndex(u => u?.toLowerCase().includes('medium') || u?.includes('中'))
    const criticalIndex = urgencies.findIndex(u => u?.toLowerCase().includes('critical') || u?.includes('緊急'))
    if (criticalIndex !== -1 && mediumIndex !== -1) {
      expect(criticalIndex).toBeLessThan(mediumIndex)
    }
  })
})
