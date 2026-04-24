import { test, expect } from '@playwright/test';

test.describe('Restocking page (R2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking');
  });

  test('loads with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible();
  });

  test('shows summary stats: recommendations count and total cost', async ({ page }) => {
    await expect(page.getByText('Recommendations', { exact: true })).toBeVisible();
    await expect(page.getByText('Total Est. Cost')).toBeVisible();
  });

  test('recommendations table is visible with column headers', async ({ page }) => {
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Priority' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'SKU' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Item' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Est. Cost' })).toBeVisible();
  });

  test('high-priority items appear before low-priority items', async ({ page }) => {
    const firstDataRow = page.getByRole('table').getByRole('row').nth(1);
    await expect(firstDataRow.getByRole('cell').first()).toContainText('high');
  });

  test('budget ceiling input is present and accepts a value', async ({ page }) => {
    const input = page.getByRole('spinbutton', { name: 'Budget ceiling' });
    await expect(input).toBeVisible();
    await input.fill('50000');
    await expect(input).toHaveValue('50000');
  });

  test('setting a low budget ceiling reduces displayed recommendations', async ({ page }) => {
    const table = page.getByRole('table');
    const initialCount = await table.getByRole('row').count();

    // $30,000 budget allows only the cheapest high-priority item ($25,507) + a few low-priority items
    await page.getByRole('spinbutton', { name: 'Budget ceiling' }).fill('30000');
    // Wait for debounce (500ms) + API call + re-render
    await page.waitForTimeout(1500);

    const filteredCount = await table.getByRole('row').count();
    expect(filteredCount).toBeLessThan(initialCount);
  });

  test('each recommendation row has a valid estimated cost', async ({ page }) => {
    const dataRows = page.getByRole('table').getByRole('row').filter({ hasNotText: 'Est. Cost' });
    const count = await dataRows.count();
    expect(count).toBeGreaterThan(0);

    // Verify first data row has a dollar amount in Est. Cost cell
    const firstRow = dataRows.first();
    const costCell = firstRow.getByRole('cell').nth(8);
    await expect(costCell).toContainText('$');
  });
});
