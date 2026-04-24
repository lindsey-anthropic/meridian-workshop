import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('all nav links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Inventory' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Finance' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Restocking' })).toBeVisible();
  });

  test('navigates to Reports page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Reports' }).click();
    await expect(page).toHaveURL('/reports');
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible();
  });

  test('navigates to Restocking page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Restocking' }).click();
    await expect(page).toHaveURL('/restocking');
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible();
  });
});
