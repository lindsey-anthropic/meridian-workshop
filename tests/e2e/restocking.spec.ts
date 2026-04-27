import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('app-locale', 'en')
  })
})

test.describe('Restocking page', () => {
  test('renders recommendations with default budget', async ({ page }) => {
    await page.goto('/restocking')

    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible()

    // Summary stats are rendered
    await expect(page.getByText('Recommended', { exact: true })).toBeVisible()
    await expect(page.getByText('Budget', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Items within budget', { exact: true })).toBeVisible()
    await expect(page.getByText('Items above budget', { exact: true })).toBeVisible()

    // Within-budget table has at least one row
    const rows = page.locator('table').first().locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('reducing the budget shrinks the within-budget list', async ({ page }) => {
    await page.goto('/restocking')

    const rows = page.locator('table').first().locator('tbody tr')
    await expect(rows.first()).toBeVisible()
    const initialCount = await rows.count()
    expect(initialCount).toBeGreaterThan(0)

    // Drop the budget; debounced reload triggers a new recommendation set
    const budgetInput = page.getByPlaceholder(/Enter budget/i)
    await budgetInput.fill('5000')

    // Wait for the within-budget heading to reflect the new count
    await expect(page.getByRole('heading', { level: 3 }).filter({ hasText: /within budget/i }))
      .toContainText(/within budget \(\d+\)/)

    const newCount = await rows.count()
    expect(newCount).toBeLessThanOrEqual(initialCount)
  })

  test('selection updates the footer total and enables the action button', async ({ page }) => {
    await page.goto('/restocking')

    const createBtn = page.getByRole('button', { name: 'Create Purchase Orders' })
    await expect(createBtn).toBeDisabled()

    const selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' })
    await selectAllCheckbox.check()

    await expect(createBtn).toBeEnabled()
    await expect(page.getByText(/items selected/i)).toBeVisible()
    // The footer should show a non-zero dollar total once everything is selected
    await expect(page.locator('text=/items selected · \\$[1-9]/i')).toBeVisible()
  })
})
