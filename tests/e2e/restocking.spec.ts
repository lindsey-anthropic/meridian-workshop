import { test, expect } from '@playwright/test';

test.describe('Restocking page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking');
  });

  test('shows recommendations table with data', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'SKU' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Urgency' })).toBeVisible();
  });

  test('shows high-urgency items at the top', async ({ page }) => {
    const firstUrgencyCell = page.getByRole('cell', { name: /High|Medium|Low/ }).first();
    await expect(firstUrgencyCell).toContainText('High');
  });

  test('budget ceiling input updates item count', async ({ page }) => {
    const budgetInput = page.getByRole('spinbutton');
    await expect(budgetInput).toBeVisible();

    const summaryBefore = await page.getByText(/items within budget/).innerText();

    await budgetInput.fill('10000');
    await page.waitForTimeout(300);

    const summaryAfter = await page.getByText(/items within budget/).innerText();
    expect(summaryAfter).not.toBe(summaryBefore);
  });

  test('no raw i18n keys rendered on page', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('restocking.urgency.unknown');
  });
});
