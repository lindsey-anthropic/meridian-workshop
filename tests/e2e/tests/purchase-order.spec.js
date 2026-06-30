// Purchase Order creation flow (Dashboard → backlog shortage → Create PO).
// Validates the newly implemented PO endpoints + modal end to end, so the
// "Create PO" action no longer 404s during a demo.
const { test, expect } = require('@playwright/test')

test.describe('Purchase Orders (Dashboard)', () => {
  test('operator can create a PO from a backlog shortage', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Overview', level: 2 })).toBeVisible()

    // Open the create-PO modal from the first shortage row.
    await page.getByRole('button', { name: 'Create PO' }).first().click()
    await expect(page.getByRole('heading', { name: 'Create Purchase Order' })).toBeVisible()

    // Quantity is pre-seeded from the shortage; fill the remaining required fields.
    await page.locator('#po-supplier').fill('Acme Supply Co')
    await page.locator('#po-cost').fill('12.5')
    await page.locator('#po-date').fill('2026-08-01')

    // Submit via the modal's primary button.
    await page.locator('.modal-container .btn-primary').click()

    // Modal closes on success and the row flips to a "View PO" action.
    await expect(page.getByRole('heading', { name: 'Create Purchase Order' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'View PO' }).first()).toBeVisible()
  })
})
