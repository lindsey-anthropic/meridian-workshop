// R2 — Restocking recommendations
// These tests verify the new Restocking view: urgency-based purchase order recommendations
// with an optional budget ceiling.

const { test, expect } = require('@playwright/test')

test.describe('Restocking Page', () => {
  test('loads with summary stats and recommendation table', async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.getByRole('heading', { name: 'Restocking' })).toBeVisible()
    await expect(page.getByText('Critical Items')).toBeVisible()
    await expect(page.getByText('Items to Restock')).toBeVisible()
    await expect(page.getByText('Total Est. Cost')).toBeVisible()
  })

  test('shows 4 recommendations without budget', async ({ page }) => {
    await page.goto('/restocking')

    // Table body should have 4 rows
    await expect(page.locator('tbody tr')).toHaveCount(4)

    // All items are Critical urgency (demand < stock on hand)
    await expect(page.getByRole('cell', { name: 'Critical' })).toHaveCount(4)
  })

  test('budget ceiling input and Calculate button are present', async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.getByRole('spinbutton', { name: 'Budget Ceiling' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Calculate' })).toBeVisible()
  })

  test('budget ceiling limits recommendations to what fits', async ({ page }) => {
    await page.goto('/restocking')

    // $30,000 budget: only TMP-201 ($15,663) fits; next item PSU-508 ($23,188) would exceed it
    await page.getByRole('spinbutton', { name: 'Budget Ceiling' }).fill('30000')
    await page.getByRole('button', { name: 'Calculate' }).click()
    await page.waitForTimeout(600)

    await expect(page.locator('tbody tr')).toHaveCount(1)
    await expect(page.getByRole('cell', { name: 'TMP-201' })).toBeVisible()
  })

  test('large budget returns all recommendations', async ({ page }) => {
    await page.goto('/restocking')

    await page.getByRole('spinbutton', { name: 'Budget Ceiling' }).fill('500000')
    await page.getByRole('button', { name: 'Calculate' }).click()
    await page.waitForTimeout(600)

    await expect(page.locator('tbody tr')).toHaveCount(4)
  })

  test('warehouse filter scopes recommendations to that location', async ({ page }) => {
    await page.goto('/restocking')

    // Filter to London — only London items should appear
    await page.locator('select').nth(1).selectOption('London')
    await page.waitForTimeout(600)

    const rows = page.locator('tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)

    // Every row should show London as warehouse
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('London')
    }
  })

  test('category filter scopes recommendations to that category', async ({ page }) => {
    await page.goto('/restocking')

    // Filter to Actuators
    await page.locator('select').nth(2).selectOption('Actuators')
    await page.waitForTimeout(600)

    const rows = page.locator('tbody tr')
    const count = await rows.count()

    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('Actuators')
    }
  })
})
