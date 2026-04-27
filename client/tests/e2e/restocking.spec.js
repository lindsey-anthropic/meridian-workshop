import { test, expect } from '@playwright/test'

const STORAGE_KEY = 'restocking-budget'

test.describe('Restocking view', () => {
  test.beforeEach(async ({ page }) => {
    // Pin locale to en and reset stored budget so tests are deterministic.
    await page.addInitScript(() => {
      window.localStorage.setItem('app-locale', 'en')
      window.localStorage.setItem('restocking-budget', '500000')
    })
    await page.goto('/restocking')
  })

  test('renders title, summary tiles, and recommendations table', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 2, name: 'Restocking Recommendations' })
    ).toBeVisible()

    for (const tile of ['Recommendations', 'Total Recommended Cost', 'Budget Used', 'Remaining Budget']) {
      await expect(page.getByText(tile, { exact: true })).toBeVisible()
    }

    await expect(page.getByRole('table')).toBeVisible()
  })

  test('default budget produces at least one recommendation', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('R2 — setting budget to 0 produces zero recommendations and shows the empty state', async ({ page }) => {
    await page.getByLabel('Monthly budget').fill('0')

    // Empty-state message renders inside a card.
    await expect(
      page.getByText(/No restocking needed at this budget/)
    ).toBeVisible({ timeout: 5000 })
  })

  test('R2 — increasing budget never reduces the recommendation count (monotonic)', async ({ page }) => {
    const rows = page.locator('table tbody tr')

    await page.getByLabel('Monthly budget').fill('20000')
    await page.waitForTimeout(500) // debounce + refetch
    const lowCount = await rows.count()

    await page.getByLabel('Monthly budget').fill('10000000')
    // Wait for the row count to settle by polling.
    await expect.poll(async () => rows.count(), { timeout: 5000 }).toBeGreaterThanOrEqual(lowCount)
  })

  test('R2 — Location filter narrows the recommendation set', async ({ page }) => {
    const rows = page.locator('table tbody tr')

    await page.getByLabel('Monthly budget').fill('10000000')
    await page.waitForTimeout(500)
    const allCount = await rows.count()

    await page.getByRole('combobox').nth(1).selectOption('London')
    await page.waitForTimeout(500)

    // London-only count should never exceed the all-locations count.
    const londonCount = await rows.count()
    expect(londonCount).toBeLessThanOrEqual(allCount)

    // Every visible warehouse cell should read "London".
    if (londonCount > 0) {
      const warehouseCells = page.locator('table tbody td:nth-child(4)')
      const warehouses = await warehouseCells.allTextContents()
      for (const w of warehouses) {
        expect(w.trim()).toBe('London')
      }
    }
  })

  test('R2 — locale switch translates the page title and rationale', async ({ page }) => {
    await page.getByRole('button', { name: 'English' }).first().click()
    await page.getByRole('button', { name: '日本語' }).click()

    await expect(
      page.getByRole('heading', { level: 2, name: '補充推奨' })
    ).toBeVisible()

    // Rationale strings should no longer contain the en-locale phrase "Below reorder point".
    const rows = page.locator('table tbody tr')
    if (await rows.count() > 0) {
      const rationaleCells = page.locator('table tbody td:nth-child(10)')
      const cells = await rationaleCells.allTextContents()
      for (const c of cells) {
        expect(c).not.toContain('Below reorder point')
      }
    }
  })

  test('R2 — Export CSV button is present and enabled when there are recommendations', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Export CSV' })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    // We don't actually trigger the download in CI to keep the suite fast and headless-friendly.
  })
})
