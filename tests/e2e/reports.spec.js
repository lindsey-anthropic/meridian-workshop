const { test, expect } = require('@playwright/test');

test.describe('Reports page (R1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports');
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible();
  });

  test('quarterly performance table has 4 rows', async ({ page }) => {
    const rows = page.locator('table').first().locator('tbody tr');
    await expect(rows).toHaveCount(4);
  });

  test('quarterly row labels follow Q#-YYYY format', async ({ page }) => {
    const cells = page.locator('table').first().locator('tbody tr td:first-child');
    const count = await cells.count();
    for (let i = 0; i < count; i++) {
      await expect(cells.nth(i)).toHaveText(/^Q[1-4]-\d{4}$/);
    }
  });

  test('month-over-month table has 12 rows', async ({ page }) => {
    const tables = page.locator('table');
    const momTable = tables.nth(1);
    await expect(momTable.locator('tbody tr')).toHaveCount(12);
  });

  test('summary cards show numeric values', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)', { exact: true })).toBeVisible();
    await expect(page.getByText('Total Orders (YTD)', { exact: true })).toBeVisible();
    await expect(page.getByText(/\$[\d,]+\.\d{2}/).first()).toBeVisible();
  });

  test('best performing quarter card is visible', async ({ page }) => {
    await expect(page.getByText('Best Performing Quarter', { exact: true })).toBeVisible();
    await expect(page.getByText(/Q[1-4]-\d{4}/).first()).toBeVisible();
  });

  test('monthly revenue trend shows 12 months', async ({ page }) => {
    await expect(page.getByText('Jan 2025').first()).toBeVisible();
    await expect(page.getByText('Dec 2025').first()).toBeVisible();
  });
});
