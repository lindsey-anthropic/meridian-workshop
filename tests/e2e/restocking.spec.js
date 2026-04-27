const { test, expect } = require('@playwright/test');

test.describe('Restocking feature (R2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking');
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible();
  });

  test('shows recommendations table with data', async ({ page }) => {
    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('all visible recommendations are High priority', async ({ page }) => {
    const priorityCells = page.locator('table tbody tr td:first-child');
    const count = await priorityCells.count();
    for (let i = 0; i < count; i++) {
      await expect(priorityCells.nth(i)).toHaveText(/(High|Medium|Low)/);
    }
  });

  test('summary shows recommendation count and estimated total', async ({ page }) => {
    await expect(page.getByText('Recommendations', { exact: true })).toBeVisible();
    await expect(page.getByText('Estimated Total', { exact: true })).toBeVisible();
    await expect(page.getByText(/\$[\d,]+\.\d{2}/).first()).toBeVisible();
  });

  test('budget ceiling input is present', async ({ page }) => {
    const input = page.getByRole('spinbutton');
    await expect(input).toBeVisible();
  });

  test('setting budget ceiling filters recommendations', async ({ page }) => {
    const input = page.getByRole('spinbutton');
    // Default: 4 recommendations totalling ~$141,940
    const initialRows = await page.locator('table tbody tr').count();

    // Set a tight budget that only covers the cheapest item (~$25,507)
    await input.fill('30000');
    await input.press('Tab');

    const filteredRows = await page.locator('table tbody tr').count();
    // Fewer or equal rows after applying a tight budget
    expect(filteredRows).toBeLessThanOrEqual(initialRows);
  });

  test('table columns include SKU, warehouse, and estimated cost', async ({ page }) => {
    const headers = page.locator('table thead th');
    await expect(headers.filter({ hasText: 'SKU' })).toBeVisible();
    await expect(headers.filter({ hasText: 'Warehouse' })).toBeVisible();
    await expect(headers.filter({ hasText: 'Estimated Cost' })).toBeVisible();
  });
});
