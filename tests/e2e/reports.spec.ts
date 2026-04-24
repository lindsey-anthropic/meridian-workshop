import { test, expect } from '@playwright/test';

test.describe('Reports page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports');
  });

  test('shows quarterly performance table with data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Q1-2025' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Q2-2025' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Q3-2025' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Q4-2025' })).toBeVisible();
  });

  test('shows monthly revenue trend section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Monthly Revenue Trend' })).toBeVisible();
  });

  test('shows month-over-month analysis table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Month-over-Month Analysis' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Jan 2025' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Dec 2025' })).toBeVisible();
  });

  test('shows YTD summary stats', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible();
    await expect(page.getByText('Total Orders (YTD)')).toBeVisible();
    await expect(page.getByText('Best Performing Quarter')).toBeVisible();
  });

  test('no raw i18n keys rendered on page', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\w+\.\w+\.\w+/);
  });
});
