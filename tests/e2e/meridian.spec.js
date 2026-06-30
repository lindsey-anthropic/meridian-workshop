import { test, expect } from '@playwright/test';

test.describe('Meridian Components Inventory Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard home page
    await page.goto('/');
  });

  test('should display overview metrics and render dashboard correctly', async ({ page }) => {
    // Check main title
    await expect(page.locator('h1')).toContainText('Catalyst Components');

    // Check main KPI cards are rendered
    await expect(page.locator('.kpi-grid')).toBeVisible();

    // Verify presence of navigation links
    await expect(page.locator('nav.nav-tabs')).toBeVisible();
  });

  test('should navigate to inventory page and display stock list', async ({ page }) => {
    // Click on Inventory tab
    await page.click('a[href="/inventory"]');

    // Confirm URL change
    await expect(page).toHaveURL(/\/inventory/);

    // Verify inventory table exists
    await expect(page.locator('.table-container')).toBeVisible();
  });

  test('should navigate to reports and display quarterly stats', async ({ page }) => {
    // Click on Reports tab
    await page.click('a[href="/reports"]');

    // Confirm URL change
    await expect(page).toHaveURL(/\/reports/);

    // Verify quarterly table exists
    await expect(page.locator('.reports-table')).toBeVisible();

    // Verify presence of monthly trend chart
    await expect(page.locator('.bar-chart')).toBeVisible();
  });

  test('should navigate to restocking and interact with budget ceiling', async ({ page }) => {
    // Click on Restocking tab
    await page.click('a[href="/restocking"]');

    // Confirm URL change
    await expect(page).toHaveURL(/\/restocking/);

    // Verify budget panel is visible
    await expect(page.locator('.budget-panel')).toBeVisible();

    // Verify recommendations table is displayed
    await expect(page.locator('.backlog-table')).toBeVisible();
  });
});
