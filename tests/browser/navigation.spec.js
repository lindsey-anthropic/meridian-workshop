const { test, expect } = require('@playwright/test');

test('app loads and shows header', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Catalyst Components' })).toBeVisible();
});

test('navigation links reach correct pages', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Reports' }).click();
  await expect(page).toHaveURL('/reports');
  await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible();

  await page.getByRole('link', { name: 'Restocking' }).click();
  await expect(page).toHaveURL('/restocking');
  await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible();

  await page.getByRole('link', { name: 'Overview' }).click();
  await expect(page).toHaveURL('/');
});

test('global filters are present on every page', async ({ page }) => {
  for (const path of ['/', '/reports', '/restocking']) {
    await page.goto(path);
    await expect(page.getByRole('combobox').first()).toBeVisible();
  }
});
