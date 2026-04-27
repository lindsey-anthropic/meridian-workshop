// @ts-check
const { test, expect } = require('@playwright/test')

const BASE = 'http://localhost:3000'

async function waitForLoad(page) {
  await page.waitForFunction(() => {
    const texts = ['Loading...', 'Loading reports...']
    return !Array.from(document.querySelectorAll('*')).some(
      el => el.children.length === 0 && texts.includes(el.textContent.trim())
    )
  }, { timeout: 10000 })
}

// ─────────────────────────────────────────────────────────────────────────────
// Flow 1: Inventory view
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Flow 1 — Inventory view', () => {
  test('loads inventory table with data', async ({ page }) => {
    await page.goto(`${BASE}/inventory`)
    await waitForLoad(page)

    await expect(page.getByRole('heading', { name: 'Inventory', level: 2 })).toBeVisible()

    const rows = page.locator('tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('warehouse filter reduces visible rows', async ({ page }) => {
    await page.goto(`${BASE}/inventory`)
    await waitForLoad(page)

    const allRows = await page.locator('tbody tr').count()

    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(400)

    const filteredRows = await page.locator('tbody tr').count()
    expect(filteredRows).toBeGreaterThan(0)
    expect(filteredRows).toBeLessThan(allRows)
  })

  test('category filter reduces visible rows', async ({ page }) => {
    await page.goto(`${BASE}/inventory`)
    await waitForLoad(page)

    const allRows = await page.locator('tbody tr').count()

    await page.locator('select').nth(2).selectOption('Sensors')
    await page.waitForTimeout(400)

    const filteredRows = await page.locator('tbody tr').count()
    expect(filteredRows).toBeGreaterThan(0)
    expect(filteredRows).toBeLessThanOrEqual(allRows)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Flow 2: Warehouse filter — cross-module consistency
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Flow 2 — Warehouse filter state consistency', () => {
  test('filter set on inventory persists when navigating to orders', async ({ page }) => {
    await page.goto(`${BASE}/inventory`)
    await waitForLoad(page)

    const locationSelect = page.locator('select').nth(1)
    await locationSelect.selectOption('London')
    await page.waitForTimeout(300)

    await page.getByRole('link', { name: 'Orders' }).click()
    await waitForLoad(page)

    expect(await locationSelect.inputValue()).toBe('London')
  })

  test('reset button clears all filters', async ({ page }) => {
    await page.goto(`${BASE}/inventory`)
    await waitForLoad(page)

    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(300)

    const resetBtn = page.getByRole('button', { name: /reset/i })
    await expect(resetBtn).toBeEnabled()
    await resetBtn.click()
    await page.waitForTimeout(300)

    expect(await page.locator('select').nth(1).inputValue()).toBe('all')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Flow 3: Report generation
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Flow 3 — Report generation', () => {
  test('reports page loads quarterly data for all 4 quarters', async ({ page }) => {
    await page.goto(`${BASE}/reports`)
    await page.waitForSelector('text=Quarterly Performance', { timeout: 10000 })
    await waitForLoad(page)

    for (const q of ['Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025']) {
      await expect(page.getByText(q).first()).toBeVisible()
    }
  })

  test('reports page shows monthly trend chart', async ({ page }) => {
    await page.goto(`${BASE}/reports`)
    await waitForLoad(page)

    await expect(page.getByRole('heading', { name: 'Monthly Revenue Trend' })).toBeVisible()
    await expect(page.getByText('Jan 2025').first()).toBeVisible()
  })

  test('reports page shows YTD summary stats', async ({ page }) => {
    await page.goto(`${BASE}/reports`)
    await waitForLoad(page)

    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible()
    await expect(page.getByText('Best Performing Quarter')).toBeVisible()
  })

  test('warehouse filter on reports changes quarterly totals', async ({ page }) => {
    await page.goto(`${BASE}/reports`)
    await waitForLoad(page)

    const q1Row = page.locator('tbody tr').first()
    const before = await q1Row.locator('td').nth(1).textContent()

    await page.locator('select').nth(1).selectOption('Tokyo')
    await page.waitForTimeout(800)

    const after = await q1Row.locator('td').nth(1).textContent()
    expect(after).not.toBe(before)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Flow 4: Restocking recommendations
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Flow 4 — Restocking recommendations', () => {
  test('shows prompt when no budget is entered', async ({ page }) => {
    await page.goto(`${BASE}/restocking`)
    await page.waitForTimeout(500)

    await expect(page.getByRole('heading', { name: /restocking/i, level: 2 })).toBeVisible()
    await expect(page.getByText(/enter a budget/i)).toBeVisible()
  })

  test('entering a budget shows recommendation table', async ({ page }) => {
    await page.goto(`${BASE}/restocking`)
    await page.waitForTimeout(500)

    await page.locator('input[type="number"]').fill('50000')
    await page.waitForTimeout(1000)

    const rows = page.locator('tbody tr')
    await expect(rows.first()).toBeVisible({ timeout: 8000 })
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('budget ceiling shows covered items', async ({ page }) => {
    await page.goto(`${BASE}/restocking`)
    await page.waitForTimeout(500)

    await page.locator('input[type="number"]').fill('50000')
    await page.waitForTimeout(1000)

    await expect(page.getByText('Covered').first()).toBeVisible({ timeout: 8000 })
  })

  test('very small budget marks items as uncovered', async ({ page }) => {
    await page.goto(`${BASE}/restocking`)
    await page.waitForTimeout(500)

    await page.locator('input[type="number"]').fill('1')
    await page.waitForTimeout(1000)

    await expect(page.getByText('Uncovered').first()).toBeVisible({ timeout: 8000 })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Flow 5: Cross-module navigation
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Flow 5 — Cross-module navigation', () => {
  const pages = [
    { name: 'Overview', path: '/', heading: 'Overview', level: 2 },
    { name: 'Inventory', path: '/inventory', heading: 'Inventory', level: 2 },
    { name: 'Orders', path: '/orders', heading: 'Orders', level: 2 },
    { name: 'Finance', path: '/spending', heading: 'Finance Dashboard', level: 2 },
    { name: 'Demand Forecast', path: '/demand', heading: 'Demand Forecast', level: 2 },
    { name: 'Reports', path: '/reports', heading: 'Performance Reports', level: 2 },
    { name: 'Restocking', path: '/restocking', heading: /restocking/i, level: 2 },
  ]

  for (const { name, path, heading, level } of pages) {
    test(`${name} page loads without error`, async ({ page }) => {
      await page.goto(`${BASE}${path}`)
      await waitForLoad(page)

      await expect(page.getByRole('heading', { name: heading, level })).toBeVisible({ timeout: 8000 })
    })
  }

  test('nav links navigate to correct pages', async ({ page }) => {
    await page.goto(BASE)
    await waitForLoad(page)

    const navLinks = [
      { label: 'Inventory', url: '/inventory' },
      { label: 'Orders', url: '/orders' },
      { label: 'Reports', url: '/reports' },
      { label: 'Restocking', url: '/restocking' },
    ]

    for (const { label, url } of navLinks) {
      await page.getByRole('link', { name: label }).click()
      await expect(page).toHaveURL(`${BASE}${url}`)
      await waitForLoad(page)
    }
  })
})
