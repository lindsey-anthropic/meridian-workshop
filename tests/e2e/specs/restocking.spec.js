import { test, expect } from '@playwright/test'

test.describe('Restocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
  })

  test('shows page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations', level: 2 })).toBeVisible()
    await expect(page.getByText('Recommended purchase orders based on stock levels and demand forecast')).toBeVisible()
  })

  test('Calculate button is disabled until a budget is entered', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Calculate' })).toBeDisabled()
    await page.getByRole('spinbutton', { name: 'Budget Ceiling' }).fill('100000')
    await expect(page.getByRole('button', { name: 'Calculate' })).toBeEnabled()
  })

  test('shows empty state prompt before budget entry', async ({ page }) => {
    await expect(page.getByText('Enter a budget ceiling to see recommendations')).toBeVisible()
  })

  test('calculates and shows recommendations table', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Budget Ceiling' }).fill('500000')
    await page.getByRole('button', { name: 'Calculate' }).click()

    await expect(page.getByRole('heading', { name: /Restocking Recommendations \(/ })).toBeVisible()
    const rows = page.locator('.restocking-table tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('stats bar shows recommended items count and budget used', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Budget Ceiling' }).fill('500000')
    await page.getByRole('button', { name: 'Calculate' }).click()

    await expect(page.getByText('Recommended Items')).toBeVisible()
    await expect(page.getByText('Budget Used')).toBeVisible()
    await expect(page.getByText('Total Cost')).toBeVisible()
  })

  test('items within budget show "Within budget" badge', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Budget Ceiling' }).fill('500000')
    await page.getByRole('button', { name: 'Calculate' }).click()

    await expect(page.getByText('Within budget').first()).toBeVisible()
  })

  test('very small budget marks items as exceeding budget', async ({ page }) => {
    // $1 budget: all items should exceed it
    await page.getByRole('spinbutton', { name: 'Budget Ceiling' }).fill('1')
    await page.getByRole('button', { name: 'Calculate' }).click()

    await expect(page.getByText('Exceeds budget').first()).toBeVisible()
  })

  test('table has correct column headers', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Budget Ceiling' }).fill('500000')
    await page.getByRole('button', { name: 'Calculate' }).click()

    const table = page.getByRole('table')
    await expect(table.getByRole('columnheader', { name: 'SKU' })).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'Item Name' })).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'Priority' })).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'Budget Status' })).toBeVisible()
  })

  test('warehouse filter updates recommendations', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Budget Ceiling' }).fill('500000')
    await page.getByRole('button', { name: 'Calculate' }).click()
    await expect(page.getByRole('heading', { name: /Restocking Recommendations \(/ })).toBeVisible()

    // Filter to Tokyo only
    await page.getByLabel('Location').selectOption('Tokyo')
    await page.waitForTimeout(500)

    // All visible warehouse cells should say Tokyo
    const warehouseCells = page.locator('.restocking-table tbody tr td:nth-child(3)')
    const count = await warehouseCells.count()
    for (let i = 0; i < count; i++) {
      await expect(warehouseCells.nth(i)).toHaveText('Tokyo')
    }
  })
})
