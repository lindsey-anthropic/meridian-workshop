import { test, expect } from '@playwright/test'

test.describe('Dark mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('theme'))
    await page.reload()
  })

  test('starts in light mode by default', async ({ page }) => {
    const theme = await page.locator('html').getAttribute('data-theme')
    expect(theme === null || theme === 'light').toBeTruthy()
  })

  test('profile menu contains dark mode toggle', async ({ page }) => {
    await page.locator('.profile-button').click()
    await expect(page.locator('.theme-row')).toBeVisible()
    await expect(page.locator('.theme-switch')).toBeVisible()
  })

  test('toggles to dark mode via profile menu', async ({ page }) => {
    await page.locator('.profile-button').click()
    await page.locator('.theme-row').dispatchEvent('mousedown')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('persists dark mode preference after page reload', async ({ page }) => {
    await page.locator('.profile-button').click()
    await page.locator('.theme-row').dispatchEvent('mousedown')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('toggle switch reflects current theme state', async ({ page }) => {
    await page.locator('.profile-button').click()
    await expect(page.locator('.theme-switch')).not.toHaveClass(/on/)
    // dispatchEvent doesn't move focus so the dropdown stays open
    await page.locator('.theme-row').dispatchEvent('mousedown')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator('.theme-switch')).toHaveClass(/on/)
  })
})
