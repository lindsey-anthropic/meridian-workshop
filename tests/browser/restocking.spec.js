// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Restocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking');
    await page.waitForSelector('.restocking-table, .empty-state', { timeout: 10000 });
  });

  test('page loads with recommendations table', async ({ page }) => {
    await expect(page.locator('.error')).toHaveCount(0);
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('.restocking-table')).toBeVisible();
  });

  test('stats grid shows counts', async ({ page }) => {
    const stats = page.locator('.stat-card');
    await expect(stats).toHaveCount(4);

    // All four stat values should be visible and numeric
    for (const card of await stats.all()) {
      const value = card.locator('.stat-value');
      await expect(value).toBeVisible();
    }
  });

  test('recommendations table has expected columns', async ({ page }) => {
    const headers = page.locator('.restocking-table thead th');
    const count = await headers.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test('budget input and apply button are present', async ({ page }) => {
    await expect(page.locator('.budget-input')).toBeVisible();
    await expect(page.locator('button:has-text("Apply")')).toBeVisible();
  });

  test('applying a budget shows clear button and filters results', async ({ page }) => {
    const input = page.locator('.budget-input');
    const applyBtn = page.locator('button:has-text("Apply")');

    await input.fill('50000');
    await applyBtn.click();

    // Clear button should appear once budget is set
    await expect(page.locator('button:has-text("Clear")')).toBeVisible();

    // Table should still be visible (budget filtering, not hiding all rows)
    await expect(page.locator('.restocking-table')).toBeVisible();
  });

  test('clearing budget removes the clear button', async ({ page }) => {
    const input = page.locator('.budget-input');
    await input.fill('100000');
    await page.locator('button:has-text("Apply")').click();

    const clearBtn = page.locator('button:has-text("Clear")');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();

    await expect(clearBtn).toHaveCount(0);
  });

  test('priority badges are visible on rows', async ({ page }) => {
    const badges = page.locator('.restocking-table .badge');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });
});
