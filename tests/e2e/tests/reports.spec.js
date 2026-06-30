// R1 — Reports module remediation regressions.
// These lock in the three highest-value fixes verified during remediation:
// filter wiring, i18n coverage, and removal of debug console noise.
const { test, expect } = require('@playwright/test')
const { locationFilter, switchLanguage } = require('./helpers')

test.describe('Reports (R1 remediation)', () => {
  test('global Location filter updates the Reports tables', async ({ page }) => {
    await page.goto('/reports')

    // Total Orders cell of the Q1 row (cell index 1: Quarter | Total Orders | ...).
    const q1Orders = page.getByRole('row', { name: /Q1-2025/ }).getByRole('cell').nth(1)
    await expect(q1Orders).toBeVisible()
    const before = (await q1Orders.innerText()).trim()
    expect(before).not.toEqual('')

    await locationFilter(page).selectOption({ label: 'London' })

    // The core R1 defect was that Reports ignored the global filter bar.
    // Assert the data actually changes (relative — no hardcoded value).
    await expect(q1Orders).not.toHaveText(before)
  })

  test('language toggle translates the Reports headers (i18n)', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()

    await switchLanguage(page, '日本語')

    // Japanese header appears and the English one is gone — i18n coverage holds.
    await expect(page.getByRole('heading', { name: '四半期業績' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toHaveCount(0)
  })

  test('Reports loads without leftover debug console noise', async ({ page }) => {
    const noise = []
    // The old Options-API Reports view logged on mount, on every fetch, and on
    // every number/month format. None of these should appear after remediation.
    const NOISE = /Reports component mounted|Loading reports data|Fetching (quarterly|monthly) data|Quarterly data:|Monthly data:|Calculating summary stats|Formatting (number|month)|Calculating bar height|Loading complete/
    page.on('console', (msg) => {
      if (NOISE.test(msg.text())) noise.push(msg.text())
    })

    await page.goto('/reports')
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible()

    // Note: unrelated app-level errors (unimplemented /tasks endpoint) are
    // intentionally NOT asserted here — this guards only the Reports debug noise.
    expect(noise, `Unexpected Reports debug logs:\n${noise.join('\n')}`).toEqual([])
  })
})
