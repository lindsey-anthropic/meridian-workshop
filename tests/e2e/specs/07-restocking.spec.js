import { test, expect } from '@playwright/test'

/**
 * Flows 7, 8, 9 — Restocking critical flows.
 *   7: Generate recommendations against a budget ceiling.
 *   8: Adjust the budget and observe recommendations recalculate.
 *   9: Flag a recommendation as PO-issued (state transition).
 * Per proposal section 3.3.
 *
 * Note: state mutates across flow 9. Suite runs serially (workers: 1) so flow 9
 * is final. Backend should be restarted between full suite runs for clean state.
 */

test.describe('Restocking — flows 7, 8, 9', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' }).first()).toBeVisible()
    // Wait for the recommendations table to populate before tests interact with it.
    await expect(page.locator('.recommendations-table tbody tr').first()).toBeVisible({ timeout: 10000 })
  })

  test('Flow 7 — generates recommendations and applies a budget ceiling', async ({ page }) => {
    // Initial load: no budget set, all rows recommended.
    await expect(page.locator('.recommendations-table tbody tr')).not.toHaveCount(0)

    // Apply a budget ceiling.
    const apiCall = page.waitForResponse((resp) =>
      resp.url().includes('/api/recommendations') && resp.url().includes('budget=')
    )
    await page.locator('.budget-input').fill('5000')
    await apiCall

    // After applying, at least one row should be classified as Deferred.
    const deferredBadges = page.locator('.badge.warning', { hasText: 'Deferred' })
    await expect(deferredBadges.first()).toBeVisible({ timeout: 5000 })
  })

  test('Flow 8 — adjusting the budget recalculates the list', async ({ page }) => {
    // Set a tight budget first; wait for at least one deferred badge to render before counting.
    let apiCall = page.waitForResponse((resp) =>
      resp.url().includes('/api/recommendations') && resp.url().includes('budget=')
    )
    await page.locator('.budget-input').fill('5000')
    await apiCall
    await expect(
      page.locator('.badge.warning').filter({ hasText: 'Deferred' }).first()
    ).toBeVisible({ timeout: 5000 })
    const deferredAtLowBudget = await page.locator('.badge.warning', { hasText: 'Deferred' }).count()
    expect(deferredAtLowBudget).toBeGreaterThan(0)

    // Then a generous budget; deferred badges should largely disappear.
    apiCall = page.waitForResponse((resp) =>
      resp.url().includes('/api/recommendations') && resp.url().includes('budget=')
    )
    await page.locator('.budget-input').fill('500000')
    await apiCall
    // Wait for the recommended-cost tile to update before recounting.
    await expect.poll(
      async () => page.locator('.badge.warning', { hasText: 'Deferred' }).count(),
      { timeout: 5000 }
    ).toBeLessThan(deferredAtLowBudget)
  })

  test('Flow 9 — flagging a recommendation as PO-issued is a state transition', async ({ page }) => {
    // Find the first row that still shows an Issue PO button (skip already-issued rows).
    const issuableButtons = page.locator('button.issue-po-btn')
    const initialCount = await issuableButtons.count()
    test.skip(initialCount === 0, 'No issuable rows — backend has all POs already issued from prior runs.')

    const targetRow = page.locator('.recommendations-table tbody tr').filter({
      has: page.locator('button.issue-po-btn'),
    }).first()
    const targetSku = await targetRow.locator('td').first().innerText()

    const postCall = page.waitForResponse(
      (resp) => resp.url().includes('/api/purchase-orders') && resp.request().method() === 'POST',
    )
    const refreshCall = page.waitForResponse(
      (resp) => resp.url().includes('/api/recommendations') && resp.request().method() === 'GET',
    )
    await targetRow.locator('button.issue-po-btn').click()
    await postCall
    await refreshCall

    // The same SKU's row should now show the PO Issued pill rather than the Issue PO button.
    const updatedRow = page.locator('.recommendations-table tbody tr').filter({ hasText: targetSku }).first()
    await expect(updatedRow.locator('.po-issued-pill')).toBeVisible()
    await expect(updatedRow.locator('.badge.info')).toBeVisible()
  })
})
