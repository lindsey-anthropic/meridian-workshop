const { test, expect } = require('@playwright/test');

const PAGES = [
  { name: 'Overview',       url: '/',           heading: 'Overview' },
  { name: 'Inventory',      url: '/inventory',  heading: 'Inventory' },
  { name: 'Orders',         url: '/orders',     heading: 'Orders' },
  { name: 'Finance',        url: '/spending',   heading: 'Finance Dashboard' },
  { name: 'Demand Forecast',url: '/demand',     heading: 'Demand' },
  { name: 'Reports',        url: '/reports',    heading: 'Performance Reports' },
  { name: 'Restocking',     url: '/restocking', heading: 'Restocking Recommendations' },
];

test.describe('Navigation', () => {
  for (const page of PAGES) {
    test(`${page.name} page loads`, async ({ page: p }) => {
      await p.goto(page.url);
      await expect(p.getByRole('heading', { name: page.heading, level: 2 })).toBeVisible();
    });
  }

  test('nav links are all present', async ({ page }) => {
    await page.goto('/');
    for (const { name } of PAGES) {
      await expect(page.getByRole('link', { name })).toBeVisible();
    }
  });

  test('active nav link reflects current route', async ({ page }) => {
    await page.goto('/reports');
    const reportsLink = page.getByRole('link', { name: 'Reports' });
    await expect(reportsLink).toHaveClass(/active|router-link-active/);
  });
});
