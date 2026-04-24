import { test, expect } from '@playwright/test'

test.describe('Restocking page (R2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForSelector('.stat-card', { timeout: 8000 })
  })

  test('shows recommendation table with items', async ({ page }) => {
    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCountGreaterThan(0)
  })

  test('stat cards show item count and cost', async ({ page }) => {
    const statValues = await page.locator('.stat-value').allTextContents()
    const hasCost = statValues.some(v => v.includes('$'))
    expect(hasCost).toBe(true)
  })

  test('demand trend badges are present', async ({ page }) => {
    const badges = page.locator('.badge.increasing, .badge.stable, .badge.decreasing')
    await expect(badges.first()).toBeVisible()
  })

  test('priority badges are present', async ({ page }) => {
    const badges = page.locator('.badge.high, .badge.medium, .badge.low')
    await expect(badges.first()).toBeVisible()
  })

  test('budget ceiling filters items', async ({ page }) => {
    const allRows = await page.locator('tbody tr').count()

    await page.fill('.budget-field', '10000')
    await page.click('.btn-primary')
    await page.waitForTimeout(500)

    await expect(page.locator('.budget-status')).toBeVisible()
    await expect(page.locator('.budget-status')).toContainText(/\$10,000/)

    const inBadges = await page.locator('.badge.success').count()
    const outBadges = await page.locator('.badge.danger').count()
    expect(inBadges + outBadges).toBeGreaterThan(0)

    const totalRows = await page.locator('tbody tr').count()
    expect(totalRows).toEqual(allRows)
  })

  test('clearing budget removes budget column', async ({ page }) => {
    await page.fill('.budget-field', '5000')
    await page.click('.btn-primary')
    await page.waitForTimeout(300)
    await expect(page.locator('.btn-secondary')).toBeVisible()

    await page.click('.btn-secondary')
    await page.waitForTimeout(300)
    await expect(page.locator('.budget-status')).not.toBeVisible()
  })
})
