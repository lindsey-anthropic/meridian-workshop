import { test, expect } from '@playwright/test'

test.describe('D3 — Dark mode', () => {
  test.beforeEach(async ({ page }) => {
    // Pin to en. localStorage is empty per fresh context so we don't need to
    // clear app-theme here — and clearing it on every navigation would defeat
    // the persistence test below.
    await page.addInitScript(() => {
      window.localStorage.setItem('app-locale', 'en')
    })
  })

  test('defaults to light theme on a fresh visit (no prefers-color-scheme override)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    const themeAttr = await page.locator('html').getAttribute('data-theme')
    expect(themeAttr).toBe('light')
  })

  test('respects prefers-color-scheme: dark on first load', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    const themeAttr = await page.locator('html').getAttribute('data-theme')
    expect(themeAttr).toBe('dark')
  })

  test('toggle switches the theme and persists across reloads', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.getByRole('button', { name: 'Switch to dark theme' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Reload — preference should persist via localStorage.
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Toggle back.
    await page.getByRole('button', { name: 'Switch to light theme' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  test('paper background changes between themes', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    const lightPaper = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).getPropertyValue('--color-paper').trim()
    )

    await page.getByRole('button', { name: 'Switch to dark theme' }).click()

    const darkPaper = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).getPropertyValue('--color-paper').trim()
    )

    expect(lightPaper).not.toBe(darkPaper)
    expect(lightPaper.toLowerCase()).toBe('#ffffff')
  })
})
