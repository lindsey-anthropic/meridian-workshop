import { test, expect } from '@playwright/test';

test.describe('Overview Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads dashboard with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Factory Inventory Management System');
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  });

  test('navigation links are all present', async ({ page }) => {
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: 'Overview' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Inventory' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Orders' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Restocking' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Reports' })).toBeVisible();
  });

  test('KPI cards are visible', async ({ page }) => {
    await expect(page.getByText('Inventory Turnover Rate')).toBeVisible();
    await expect(page.getByText('Orders Fulfilled')).toBeVisible();
    await expect(page.getByText('Order Fill Rate')).toBeVisible();
    await expect(page.getByText('Revenue (Orders) YTD')).toBeVisible();
  });

  test('inventory shortages table renders rows', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Inventory Shortages/ })).toBeVisible();
    const rows = page.getByRole('table').filter({ has: page.getByText('Shortage') }).getByRole('row');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(2); // header + at least 1 data row
  });

  test('global filters reset button starts disabled', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Reset all filters' })).toBeDisabled();
  });

  test('selecting a location filter enables reset button', async ({ page }) => {
    const locationSelect = page.locator('.filter-group').filter({ hasText: 'Location' }).getByRole('combobox');
    await locationSelect.selectOption('London');
    await expect(page.getByRole('button', { name: 'Reset all filters' })).toBeEnabled();
  });

  test('reset button clears filters', async ({ page }) => {
    const locationSelect = page.locator('.filter-group').filter({ hasText: 'Location' }).getByRole('combobox');
    await locationSelect.selectOption('Tokyo');
    await page.getByRole('button', { name: 'Reset all filters' }).click();
    await expect(locationSelect).toHaveValue('all');
    await expect(page.getByRole('button', { name: 'Reset all filters' })).toBeDisabled();
  });
});
