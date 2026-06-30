// R2 — Restocking recommendations regressions.
// Tests assert RELATIVE behavior (more budget -> more funded; longer lead time ->
// more urgent), never exact recommended quantities, because the demand-rate model
// (forecast / 30-day window) is an unconfirmed domain assumption. Restocking is
// read-only: we test recommendation/budget logic, never PO persistence.
const { test, expect } = require('@playwright/test')
const { locationFilter } = require('./helpers')

const budgetInput = (page) => page.locator('#budget-input')
const leadTimeInput = (page) => page.locator('#lead-time-input')
const calculate = (page) => page.getByRole('button', { name: 'Calculate' })
const restockTable = (page) => page.locator('.restock-table')

test.describe('Restocking (R2)', () => {
  test('submitting a budget returns recommendations with urgency badges', async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations', level: 2 })).toBeVisible()
    await expect(restockTable(page)).toBeVisible()

    // At least one recommendation row...
    expect(await page.locator('.restock-table tbody tr').count()).toBeGreaterThan(0)
    // ...each carrying a valid urgency classification.
    await expect(page.getByText(/^(Critical|High|Medium)$/).first()).toBeVisible()
  })

  test('a longer lead time surfaces critical (stock-out-before-arrival) items', async ({ page }) => {
    await page.goto('/restocking')
    await expect(restockTable(page)).toBeVisible()

    // Relative behavior: extending the lead time means more items will run out
    // before a replenishment PO can arrive, so urgency escalates to Critical.
    await leadTimeInput(page).fill('60')
    await calculate(page).click()

    await expect(page.getByText('Critical', { exact: true }).first()).toBeVisible()
    // Critical rows carry the explicit "stocks out before arrival" marker.
    await expect(page.locator('.row-stockout').first()).toBeVisible()
  })

  test('funded items appear first; items defer once the budget is exhausted', async ({ page }) => {
    await page.goto('/restocking') // default budget ($50,000) leaves some items deferred
    await expect(restockTable(page)).toBeVisible()

    // Some items are over budget (deferred rows carry the "row-deferred" class).
    await expect(page.locator('.restock-table .row-deferred').first()).toBeVisible()

    // Ordering invariant: every funded row precedes every deferred row, i.e. once
    // a deferred row appears, all subsequent rows are deferred too.
    const rows = page.locator('.restock-table tbody tr')
    const count = await rows.count()
    const deferredFlags = []
    for (let i = 0; i < count; i++) {
      const cls = (await rows.nth(i).getAttribute('class')) || ''
      deferredFlags.push(cls.includes('row-deferred'))
    }
    const firstDeferred = deferredFlags.indexOf(true)
    expect(firstDeferred).toBeGreaterThan(-1)
    expect(deferredFlags.slice(firstDeferred).every(Boolean)).toBeTruthy()

    // Summary reflects exposure at the UI level.
    await expect(page.locator('.deferred-card .stat-value')).not.toHaveText('0')
  })

  test('raising the budget funds everything (no deferred items)', async ({ page }) => {
    await page.goto('/restocking')
    await expect(restockTable(page)).toBeVisible()

    await budgetInput(page).fill('5000000')
    await calculate(page).click()

    // Relative behavior: more budget -> more funded -> zero deferred.
    await expect(page.locator('.deferred-card .stat-value')).toHaveText('0')
    await expect(page.getByText('Deferred', { exact: true })).toHaveCount(0)
    await expect(page.getByText('Funded', { exact: true }).first()).toBeVisible()
  })

  test('healthy stock shows a clean no-recommendations state', async ({ page }) => {
    await page.goto('/restocking')
    await expect(restockTable(page)).toBeVisible()

    // San Francisco has no items below target -> the empty/healthy state renders.
    await locationFilter(page).selectOption({ label: 'San Francisco' })

    await expect(page.getByText(/no restocking needed/)).toBeVisible()
    await expect(restockTable(page)).toHaveCount(0)
  })
})
