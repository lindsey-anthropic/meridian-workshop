import { test, expect } from '@playwright/test'

test.describe('Reports page (R1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForSelector('table', { timeout: 8000 })
  })

  test('shows quarterly performance table', async ({ page }) => {
    await expect(page.getByText(/quarterly performance/i)).toBeVisible()
    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCountGreaterThan(0)
  })

  test('quarterly table contains Q columns', async ({ page }) => {
    const firstCell = page.locator('tbody tr td strong').first()
    await expect(firstCell).toContainText(/Q\d-\d{4}/)
  })

  test('shows monthly revenue trend chart', async ({ page }) => {
    await expect(page.getByText(/monthly revenue trend/i)).toBeVisible()
    await expect(page.locator('.bar')).toHaveCountGreaterThan(0)
  })

  test('shows month-over-month analysis table', async ({ page }) => {
    await expect(page.getByText(/month.over.month/i)).toBeVisible()
  })

  test('summary stat cards are populated', async ({ page }) => {
    const statValues = page.locator('.stat-value')
    await expect(statValues).toHaveCountGreaterThan(2)
    const texts = await statValues.allTextContents()
    const hasRevenue = texts.some(t => t.includes('$'))
    expect(hasRevenue).toBe(true)
  })

  test('no console errors on load', async ({ page }) => {
    const errors = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    await page.reload()
    await page.waitForSelector('table', { timeout: 8000 })
    expect(errors).toHaveLength(0)
  })

  test('currency values are formatted correctly', async ({ page }) => {
    const cells = await page.locator('td').allTextContents()
    const currencyCells = cells.filter(c => c.startsWith('$'))
    expect(currencyCells.length).toBeGreaterThan(0)
    currencyCells.forEach(c => {
      expect(c).toMatch(/^\$[\d,]+\.\d{2}$/)
    })
  })
})
