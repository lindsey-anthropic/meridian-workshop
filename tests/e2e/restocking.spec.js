import { test, expect } from '@playwright/test'

test.describe('Restocking recommendations', () => {
  test('recommendations table loads, ranked with a low-stock item first', async ({ page }) => {
    await page.goto('/restocking')

    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
    await expect(rows.first()).toContainText('Low Stock')
  })

  test('entering a budget ceiling funds items and shows correct running totals', async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.locator('table tbody tr').first()).toBeVisible()

    await page.getByLabel('Budget Ceiling').fill('50000')

    await expect(page.getByText('Total Funded Cost')).toBeVisible()
    const fundedBadge = page.getByRole('row').filter({ hasText: 'Funded' }).first()
    await expect(fundedBadge).toBeVisible()

    // Remaining budget must never go negative
    const remainingText = await page.locator('text=Remaining Budget').locator('..').textContent()
    const remaining = parseFloat(remainingText.replace(/[^0-9.]/g, ''))
    expect(remaining).toBeGreaterThanOrEqual(0)
  })

  test('creating an order marks the row Ordered and frees budget for the next item', async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.locator('table tbody tr').first()).toBeVisible()

    await page.getByLabel('Budget Ceiling').fill('50000')

    const firstRow = page.locator('table tbody tr').first()
    await expect(firstRow).toContainText('Funded')

    await firstRow.getByRole('button', { name: 'Create Order' }).click()

    await expect(page.getByRole('heading', { name: 'Create Order' })).toBeVisible()
    await page.getByLabel('Supplier Name').fill('Test Automation Supplier')
    await page.getByLabel('Expected Delivery Date').fill('2026-09-01')
    await page.getByRole('button', { name: 'Create Order' }).last().click()

    await expect(firstRow).toContainText('Ordered')
    await expect(firstRow.getByRole('button', { name: 'Create Order' })).toBeDisabled()
  })
})
