import { test, expect } from '@playwright/test'

test.describe('Restocking — purchase order recommendations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
  })

  test('displays Restocking Recommendations heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible()
  })

  test('shows budget input and generate button', async ({ page }) => {
    await expect(page.locator('input[type="number"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Generate recommendations' })).toBeVisible()
  })

  test('generates recommendations without a budget', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate recommendations' }).click()
    await page.waitForTimeout(800)

    // Either a table with recommendations or the empty state
    const hasTable = await page.locator('.restocking-table').isVisible().catch(() => false)
    const hasEmpty = await page.getByText('No items below reorder point').isVisible().catch(() => false)
    expect(hasTable || hasEmpty).toBe(true)
  })

  test('generates recommendations with a budget ceiling', async ({ page }) => {
    await page.locator('input[type="number"]').fill('50000')
    await page.getByRole('button', { name: 'Generate recommendations' }).click()
    await page.waitForTimeout(800)

    await expect(page.locator('.restocking-table')).toBeVisible()
    const rows = page.locator('.restocking-table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('shows summary bar after generation', async ({ page }) => {
    await page.locator('input[type="number"]').fill('50000')
    await page.getByRole('button', { name: 'Generate recommendations' }).click()
    await page.waitForTimeout(800)

    await expect(page.locator('.summary-bar')).toBeVisible()
    await expect(page.getByText('Total estimated cost')).toBeVisible()
    await expect(page.getByText('Budget remaining')).toBeVisible()
  })

  test('accept button marks a row as accepted', async ({ page }) => {
    await page.locator('input[type="number"]').fill('100000')
    await page.getByRole('button', { name: 'Generate recommendations' }).click()
    await page.waitForTimeout(800)

    const acceptBtn = page.getByRole('button', { name: 'Accept' }).first()
    await acceptBtn.click()

    await expect(page.locator('.status-accepted').first()).toBeVisible()
  })

  test('reject button marks a row as rejected', async ({ page }) => {
    await page.locator('input[type="number"]').fill('100000')
    await page.getByRole('button', { name: 'Generate recommendations' }).click()
    await page.waitForTimeout(800)

    const rejectBtn = page.getByRole('button', { name: 'Reject' }).first()
    await rejectBtn.click()

    await expect(page.locator('.status-rejected').first()).toBeVisible()
  })

  test('demand trend badges are visible', async ({ page }) => {
    await page.locator('input[type="number"]').fill('100000')
    await page.getByRole('button', { name: 'Generate recommendations' }).click()
    await page.waitForTimeout(800)

    const trendCells = page.locator('.trend-increasing, .trend-stable, .trend-decreasing')
    const count = await trendCells.count()
    expect(count).toBeGreaterThan(0)
  })
})
