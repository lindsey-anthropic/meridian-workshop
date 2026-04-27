import { test, expect } from '@playwright/test'

test.describe('Restocking workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForLoadState('networkidle')
  })

  test('loads with budget input and disabled button', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Get Recommendations' })).toBeDisabled()
  })

  test('get recommendations with sufficient budget returns results', async ({ page }) => {
    await page.getByRole('spinbutton').fill('50000')
    await page.getByRole('button', { name: 'Get Recommendations' }).click()
    await page.waitForLoadState('networkidle')

    const rows = page.locator('table tbody tr')
    await expect(rows).not.toHaveCount(0)
  })

  test('summary bar shows item count and costs', async ({ page }) => {
    await page.getByRole('spinbutton').fill('50000')
    await page.getByRole('button', { name: 'Get Recommendations' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('items recommended')).toBeVisible()
    await expect(page.getByText('Total estimated cost')).toBeVisible()
    await expect(page.getByText('Remaining budget')).toBeVisible()
  })

  test('very small budget returns no recommendations', async ({ page }) => {
    await page.getByRole('spinbutton').fill('1')
    await page.getByRole('button', { name: 'Get Recommendations' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/no restocking needed/i)).toBeVisible()
  })

  test('warehouse filter scopes recommendations to that warehouse', async ({ page }) => {
    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.getByRole('spinbutton').fill('100000')
    await page.getByRole('button', { name: 'Get Recommendations' }).click()
    await page.waitForLoadState('networkidle')

    const warehouseCells = await page.locator('table tbody tr td:nth-child(4)').allTextContents()
    expect(warehouseCells.every(w => w === 'Tokyo')).toBe(true)
  })
})
