import { test, expect } from '@playwright/test'

test.describe('Restocking view (R2)', () => {
  test('loads with default budget and renders recommendations', async ({ page }) => {
    await page.goto('/restocking')
    expect(page.url()).toContain('/restocking')

    // Heading and description
    await expect(page.getByRole('heading', { name: /Restocking/i, level: 2 })).toBeVisible()

    // Budget input visible
    await expect(page.getByLabel(/Budget Ceiling/i)).toBeVisible()

    // Table renders with recommendations
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)

    // Summary cards have values
    await expect(page.locator('.stat-value').first()).toBeVisible()
    await expect(page.locator('.stat-label').first()).toBeVisible()
  })

  test('budget change updates recommendations reactively', async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForLoadState('networkidle')

    // Count recommended rows (with "Within budget" status)
    const recommendedCount1 = await page.locator('.status-pill.within').count()

    // Lower budget to $5k
    const budgetInput = page.getByLabel(/Budget Ceiling/i)
    await budgetInput.clear()
    await budgetInput.fill('5000')
    await page.waitForTimeout(1000) // Let API call settle

    // Count recommended at lower budget (should decrease)
    const recommendedCount2 = await page.locator('.status-pill.within').count()

    expect(recommendedCount2).toBeLessThanOrEqual(recommendedCount1)
  })

  test('Create Purchase Orders button works', async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForLoadState('networkidle')

    const button = page.getByRole('button', { name: /Create Purchase Orders/i })
    await expect(button).toBeVisible()
    await expect(button).not.toBeDisabled()

    // Click to create
    await button.click()
    await page.waitForTimeout(1500)

    // Success message appears (check for checkmark + text)
    await expect(page.locator('.created-msg')).toBeVisible()
  })
})
