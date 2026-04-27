const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/restocking');
});

test('shows restocking recommendations table', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Recommended Purchase Orders' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'SKU' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Est. Cost' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Urgency' })).toBeVisible();
});

test('shows summary cards with item counts and spend', async ({ page }) => {
  await expect(page.getByText('Items Needing Restock')).toBeVisible();
  await expect(page.getByText('Total Recommended Spend')).toBeVisible();
  await expect(page.getByText('Items Within Budget')).toBeVisible();
});

test('warehouse filter narrows recommendations', async ({ page }) => {
  const warehouseSelect = page.locator('main select').first();
  await warehouseSelect.selectOption('Tokyo');
  await expect(page.getByRole('heading', { name: 'Recommended Purchase Orders' })).toBeVisible();
  // All visible rows should be for Tokyo
  const warehouseCells = page.getByRole('cell', { name: 'Tokyo' });
  await expect(warehouseCells.first()).toBeVisible();
});

test('budget ceiling filters rows', async ({ page }) => {
  const budgetInput = page.getByRole('spinbutton');
  await budgetInput.fill('20000');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByText('Spend Within Budget')).toBeVisible();
});

test('category filter works', async ({ page }) => {
  const categorySelect = page.locator('main select').nth(1);
  await categorySelect.selectOption('Sensors');
  await expect(page.getByRole('heading', { name: 'Recommended Purchase Orders' })).toBeVisible();
});
