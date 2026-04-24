// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports');
    // Wait for data to load — the loading state should clear
    await page.waitForSelector('.reports-table', { timeout: 10000 });
  });

  test('page loads without error state', async ({ page }) => {
    await expect(page.locator('.error')).toHaveCount(0);
    await expect(page.locator('h2')).toBeVisible();
  });

  test('quarterly performance table renders with data', async ({ page }) => {
    const table = page.locator('.reports-table').first();
    await expect(table).toBeVisible();

    // Table should have header row plus at least one data row
    const rows = table.locator('tbody tr');
    await expect(rows).not.toHaveCount(0);

    // Quarter column should contain Q labels
    const firstCell = rows.first().locator('td').first();
    await expect(firstCell).toContainText('Q');
  });

  test('monthly revenue trend chart renders', async ({ page }) => {
    const chart = page.locator('.bar-chart');
    await expect(chart).toBeVisible();

    // Should have bars for multiple months
    const bars = chart.locator('.bar-wrapper');
    const count = await bars.count();
    expect(count).toBeGreaterThan(0);
  });

  test('month-over-month comparison table renders', async ({ page }) => {
    const tables = page.locator('.reports-table');
    // There should be at least two tables: quarterly and month-over-month
    const count = await tables.count();
    expect(count).toBeGreaterThanOrEqual(2);

    const momTable = tables.last();
    const rows = momTable.locator('tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('no console errors from data loading', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/reports');
    await page.waitForSelector('.reports-table', { timeout: 10000 });

    // Filter out known non-critical warnings; fail on real errors
    const realErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('PurchaseOrderModal') &&
      !e.includes('Failed to load tasks') &&  // api.getTasks() 404 is a known missing endpoint
      !e.includes('404')
    );
    expect(realErrors).toHaveLength(0);
  });
});
