import { test, expect } from '@playwright/test'

test.describe('Filter Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders all four filter controls', async ({ page }) => {
    await expect(page.getByRole('combobox').nth(0)).toBeVisible() // Time Period
    await expect(page.getByRole('combobox').nth(1)).toBeVisible() // Location
    await expect(page.getByRole('combobox').nth(2)).toBeVisible() // Category
    await expect(page.getByRole('combobox').nth(3)).toBeVisible() // Order Status
  })

  test('Location filter contains all warehouses', async ({ page }) => {
    const locationSelect = page.getByRole('combobox').nth(1)
    await expect(locationSelect.locator('option[value="San Francisco"]')).toBeAttached()
    await expect(locationSelect.locator('option[value="London"]')).toBeAttached()
    await expect(locationSelect.locator('option[value="Tokyo"]')).toBeAttached()
  })

  test('Category filter contains all product categories', async ({ page }) => {
    const categorySelect = page.getByRole('combobox').nth(2)
    for (const cat of ['Circuit Boards', 'Sensors', 'Actuators', 'Controllers', 'Power Supplies']) {
      await expect(categorySelect.locator(`option:has-text("${cat}")`)).toBeAttached()
    }
  })

  test('reset button is disabled when no filters active', async ({ page }) => {
    await expect(page.getByRole('button', { name: /reset/i })).toBeDisabled()
  })

  test('reset button enables when a filter is selected', async ({ page }) => {
    await page.getByRole('combobox').nth(1).selectOption('London')
    await expect(page.getByRole('button', { name: /reset/i })).toBeEnabled()
  })

  test('reset button clears all filters', async ({ page }) => {
    await page.getByRole('combobox').nth(1).selectOption('London')
    await page.getByRole('combobox').nth(2).selectOption('Sensors')
    await page.getByRole('button', { name: /reset/i }).click()
    await expect(page.getByRole('combobox').nth(1)).toHaveValue('all')
    await expect(page.getByRole('combobox').nth(2)).toHaveValue('all')
  })
})
