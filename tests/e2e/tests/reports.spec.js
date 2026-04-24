import { test, expect } from '@playwright/test';

test.describe('Reports page (R1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports');
  });

  test('loads with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible();
  });

  test('quarterly performance table has 4 data rows', async ({ page }) => {
    const table = page.getByRole('table').filter({ has: page.getByText('Quarter') });
    const dataRows = table.getByRole('row').filter({ hasNotText: 'Quarter' });
    await expect(dataRows).toHaveCount(4);
  });

  test('quarterly table shows Q1–Q4 2025', async ({ page }) => {
    const table = page.getByRole('table').filter({ has: page.getByText('Quarter') });
    await expect(table.getByText('Q1-2025')).toBeVisible();
    await expect(table.getByText('Q2-2025')).toBeVisible();
    await expect(table.getByText('Q3-2025')).toBeVisible();
    await expect(table.getByText('Q4-2025')).toBeVisible();
  });

  test('monthly revenue trend section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Monthly Revenue Trend' })).toBeVisible();
    await expect(page.getByText('Jan 2025').first()).toBeVisible();
    await expect(page.getByText('Dec 2025').first()).toBeVisible();
  });

  test('month-over-month analysis shows 12 months', async ({ page }) => {
    const table = page.getByRole('table').filter({ has: page.getByText('Growth Rate') });
    const dataRows = table.getByRole('row').filter({ hasNotText: 'Month' });
    await expect(dataRows).toHaveCount(12);
  });

  test('summary stats are displayed', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible();
    await expect(page.getByText('Best Performing Quarter')).toBeVisible();
  });

  test('global location filter affects report data', async ({ page }) => {
    const totalRevenueSection = page.locator('.stat-card, .summary-card').filter({ hasText: 'Total Revenue (YTD)' });
    const initialRevenue = await totalRevenueSection.locator('.stat-value, .summary-value').first().textContent();

    const locationSelect = page.locator('.filter-group').filter({ hasText: 'Location' }).getByRole('combobox');
    await locationSelect.selectOption('London');
    await page.waitForTimeout(500);

    const filteredRevenue = await totalRevenueSection.locator('.stat-value, .summary-value').first().textContent();
    expect(filteredRevenue).not.toBe(initialRevenue);
  });
});
