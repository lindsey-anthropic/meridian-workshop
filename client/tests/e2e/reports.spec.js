import { test, expect } from '@playwright/test'

test.describe('Reports view', () => {
  test.beforeEach(async ({ page }) => {
    // Pin to English so text assertions are deterministic regardless of test order.
    await page.addInitScript(() => {
      window.localStorage.setItem('app-locale', 'en')
    })
    await page.goto('/reports')
  })

  test('renders the three Reports sections and summary tiles', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Performance Reports' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: 'Quarterly Performance' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: 'Monthly Revenue Trend' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: 'Month-over-Month Analysis' })).toBeVisible()

    for (const label of ['Total Revenue (YTD)', 'Avg Monthly Revenue', 'Total Orders (YTD)', 'Best Performing Quarter']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible()
    }
  })

  test('quarterly table renders Q1–Q4 2025 rows', async ({ page }) => {
    const quarterlyTable = page.getByRole('table').filter({ hasText: 'Quarter' }).first()
    for (const q of ['Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025']) {
      await expect(quarterlyTable.getByText(q)).toBeVisible()
    }
  })

  test('R1 — currency renders in en-US format ($ with thousands separators)', async ({ page }) => {
    // Quarterly revenue cells should match the en-US currency pattern.
    const quarterlyTable = page.getByRole('table').filter({ hasText: 'Quarter' }).first()
    await expect(quarterlyTable.getByText(/^\$[\d,]+\.\d{2}$/).first()).toBeVisible()
  })

  test('R1 — Location filter changes Reports figures (filter integration)', async ({ page }) => {
    // Capture the unfiltered Total Orders (YTD) summary value.
    const totalOrdersTile = page.getByText('Total Orders (YTD)', { exact: true }).locator('..')
    const allLocations = (await totalOrdersTile.textContent()) || ''

    // Apply a single-warehouse filter via the global filter bar.
    // Location is the 2nd combobox in the filter row (after Time Period).
    await page.getByRole('combobox').nth(1).selectOption('London')

    // Wait for the refetch to complete by checking the value changes.
    await expect(totalOrdersTile).not.toHaveText(allLocations)
  })

  test('R1 — switching to Japanese translates the page heading and currency symbol', async ({ page }) => {
    // Open the language switcher. Each language is shown in its own native script,
    // so the Japanese option is labeled 日本語 regardless of current locale.
    await page.getByRole('button', { name: 'English' }).first().click()
    await page.getByRole('button', { name: '日本語' }).click()

    // Heading should be the ja-locale string from locales/ja.js.
    await expect(
      page.getByRole('heading', { level: 2, name: 'パフォーマンスレポート' })
    ).toBeVisible()

    // Currency on the quarterly table should switch off the dollar prefix.
    const quarterlyTable = page.getByRole('table').filter({ hasText: '四半期' }).first()
    await expect(quarterlyTable).toBeVisible()
    // We don't assert a specific yen glyph since Intl can render either ¥ or ￥.
    // We assert the absence of the dollar prefix on revenue cells instead.
    const dollarCount = await quarterlyTable.getByText(/^\$/).count()
    expect(dollarCount).toBe(0)
  })
})
