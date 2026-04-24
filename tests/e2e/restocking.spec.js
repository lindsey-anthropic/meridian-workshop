import { test, expect } from '@playwright/test'

test.describe('Restocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForSelector('tbody tr')
  })

  test('loads restocking recommendations', async ({ page }) => {
    const count = await page.locator('tbody tr').count()
    expect(count).toBeGreaterThan(0)
  })

  test('all items shown are below reorder point', async ({ page }) => {
    await page.waitForSelector('tbody tr')
    const rows = await page.locator('tbody tr').all()

    for (const row of rows) {
      const onHand = parseInt(await row.locator('td:nth-child(5)').innerText())
      const reorderPoint = parseInt(await row.locator('td:nth-child(6)').innerText())
      expect(onHand).toBeLessThanOrEqual(reorderPoint)
    }
  })

  test('summary chips are visible', async ({ page }) => {
    await expect(page.locator('.chip-red')).toBeVisible()
    await expect(page.locator('.chip-blue')).toBeVisible()
    await expect(page.locator('.chip-green')).toBeVisible()
  })

  test('within-budget chip shows dash when no budget set', async ({ page }) => {
    await expect(page.locator('.chip-green .chip-value')).toHaveText('—')
  })

  test('budget ceiling filters rows', async ({ page }) => {
    await page.waitForSelector('tbody tr')
    const totalRows = await page.locator('tbody tr').count()

    await page.fill('input[type="number"]', '1000')
    await page.waitForTimeout(300)

    const withinBudget = await page.locator('.chip-green .chip-value').innerText()
    expect(parseInt(withinBudget)).toBeLessThanOrEqual(totalRows)
  })

  test('over-budget rows are dimmed', async ({ page }) => {
    await page.fill('input[type="number"]', '1')
    await page.waitForTimeout(300)

    const dimmedRows = page.locator('tr.over-budget')
    await expect(dimmedRows.first()).toBeVisible()
  })

  test('budget warning banner appears when total exceeds ceiling', async ({ page }) => {
    await page.fill('input[type="number"]', '1')
    await page.waitForTimeout(300)

    await expect(page.locator('.budget-warning')).toBeVisible()
  })

  test('filters by warehouse', async ({ page }) => {
    await page.waitForSelector('tbody tr')
    const allRows = await page.locator('tbody tr').count()

    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('London')
    await page.waitForTimeout(300)

    const filteredRows = await page.locator('tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
  })
})
