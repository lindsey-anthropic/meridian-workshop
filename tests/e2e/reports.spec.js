const { test, expect } = require('@playwright/test')

test.describe('Reports page', () => {

  test('mostra dati 2026 nella tabella quarterly', async ({ page }) => {
    await page.goto('/reports')

    // Attende che la tabella sia visibile (non in stato loading)
    await page.waitForSelector('.reports-table', { timeout: 10000 })

    // Verifica che almeno un quarter 2026 sia presente nel DOM
    const pageText = await page.textContent('.reports-table')
    expect(pageText).toContain('2026')
  })

  test('nessun console.log spurio sulla pagina Reports', async ({ page }) => {
    const consoleLogs = []

    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text())
      }
    })

    await page.goto('/reports')
    await page.waitForSelector('.reports-table', { timeout: 10000 })

    // Attende un momento per intercettare eventuali log ritardati
    await page.waitForTimeout(500)

    expect(consoleLogs).toHaveLength(0)
  })

})
