import { test, expect } from '@playwright/test'

// The backend has no test-data reset endpoint and only allows one purchase order
// per backlog item, so this test adapts to whichever state the first backlog row
// is already in, rather than assuming a fresh "Create PO" button every run.
test.describe('Dashboard — backlog purchase order flow', () => {
  test('Create PO / View PO button opens the correct modal for the first backlog row', async ({ page }) => {
    await page.goto('/')

    const backlogSection = page.getByRole('heading', { name: /Inventory Shortages/ }).locator('..').locator('..')
    const firstRow = backlogSection.locator('table tbody tr').first()
    await expect(firstRow).toBeVisible()

    const createButton = firstRow.getByRole('button', { name: 'Create PO' })
    const viewButton = firstRow.getByRole('button', { name: 'View PO' })

    if (await createButton.count()) {
      await createButton.click()
      await expect(page.getByRole('heading', { name: 'Create Purchase Order' })).toBeVisible()

      await page.getByLabel('Supplier Name').fill('Regression Test Supplier')
      await page.getByLabel('Expected Delivery Date').fill('2026-09-15')
      await page.getByRole('button', { name: 'Create Purchase Order' }).click()

      await expect(page.getByRole('heading', { name: 'Create Purchase Order' })).not.toBeVisible()
      await expect(firstRow.getByRole('button', { name: 'View PO' })).toBeVisible()
    } else {
      await expect(viewButton).toBeVisible()
      await viewButton.click()
      await expect(page.getByRole('heading', { name: 'Purchase Order Details' })).toBeVisible()
      await expect(page.getByText('Supplier')).toBeVisible()
      await page.getByRole('button', { name: 'Close' }).click()
    }
  })
})
