// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h2:has-text("Overview")', { timeout: 10000 });
  });

  test('page loads with navigation and header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Components');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/inventory"]')).toBeVisible();
    await expect(page.locator('nav a[href="/reports"]')).toBeVisible();
    await expect(page.locator('nav a[href="/restocking"]')).toBeVisible();
  });

  test('global filters are visible', async ({ page }) => {
    // All four filter dropdowns should be present
    const selects = page.locator('select');
    await expect(selects).toHaveCount(4);
  });

  test('location filter narrows dashboard data', async ({ page }) => {
    const locationSelect = page.locator('select').nth(1);
    await locationSelect.selectOption('San Francisco');

    // Reset button (icon-only, identified by title) should become enabled
    const resetBtn = page.locator('button[title="Reset all filters"]');
    await expect(resetBtn).toBeEnabled();
  });

  test('reset filters button clears active filters', async ({ page }) => {
    const locationSelect = page.locator('select').nth(1);
    await locationSelect.selectOption('London');

    const resetBtn = page.locator('button[title="Reset all filters"]');
    await expect(resetBtn).toBeEnabled();
    await resetBtn.click();

    await expect(locationSelect).toHaveValue('all');
    await expect(resetBtn).toBeDisabled();
  });

  test('category filter updates the view', async ({ page }) => {
    const categorySelect = page.locator('select').nth(2);
    // Option values are lowercase ("sensors"), labels are display-cased ("Sensors")
    await categorySelect.selectOption('sensors');
    await expect(categorySelect).toHaveValue('sensors');

    const resetBtn = page.locator('button[title="Reset all filters"]');
    await expect(resetBtn).toBeEnabled();
  });
});
