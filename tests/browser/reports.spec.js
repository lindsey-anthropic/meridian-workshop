const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/reports');
});

test('shows quarterly performance table with data', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Q1-2025' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Q4-2025' })).toBeVisible();
});

test('shows month-over-month analysis table', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Month-over-Month Analysis' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Jan 2025' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Dec 2025' })).toBeVisible();
});

test('shows summary stats', async ({ page }) => {
  await expect(page.getByText('Total Revenue (YTD)')).toBeVisible();
  await expect(page.getByText('Total Orders (YTD)')).toBeVisible();
  await expect(page.getByText('Best Performing Quarter')).toBeVisible();
});

test('warehouse filter updates displayed data', async ({ page }) => {
  const warehouseSelect = page.locator('main select').first();
  await warehouseSelect.selectOption('London');
  // Table should still be visible after filtering
  await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible();
});

test('category filter works alongside warehouse filter', async ({ page }) => {
  const [warehouseSelect, categorySelect] = await page.locator('main select').all();
  await warehouseSelect.selectOption('San Francisco');
  await categorySelect.selectOption('Sensors');
  await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible();
});
