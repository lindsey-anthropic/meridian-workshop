import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('app-locale', 'en')
  })
})

test.describe('Reports page', () => {
  test('renders quarterly performance with four quarters', async ({ page }) => {
    await page.goto('/reports')

    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()

    const quarterRows = page.locator('table').first().locator('tbody tr')
    await expect(quarterRows).toHaveCount(4)
    await expect(quarterRows.first()).toContainText('Q1-2025')
  })

  test('global filters drive the quarterly totals (R1 regression)', async ({ page }) => {
    await page.goto('/reports')

    // Capture unfiltered Total Revenue (YTD) summary stat
    const totalRevenueLabel = page.getByText('Total Revenue (YTD)', { exact: true })
    const totalRevenueValue = totalRevenueLabel.locator('xpath=following-sibling::*[1]')
    await expect(totalRevenueValue).toBeVisible()
    const initialRevenue = (await totalRevenueValue.textContent())?.trim() ?? ''
    expect(initialRevenue).toMatch(/\$/)

    // Apply the Tokyo location filter — pre-fix this would not reload the data
    await page.getByLabel('Location').selectOption('Tokyo')

    // The Total Revenue summary must change because the dataset is now scoped
    await expect(totalRevenueValue).not.toHaveText(initialRevenue)
    await expect(totalRevenueValue).toContainText('$')
  })

  test('summary stats include all four cards', async ({ page }) => {
    await page.goto('/reports')

    const labels = ['Total Revenue (YTD)', 'Avg Monthly Revenue', 'Total Orders (YTD)', 'Best Performing Quarter']
    for (const label of labels) {
      await expect(page.getByText(label, { exact: true })).toBeVisible()
    }
  })
})
