// Shared, resilient locators/actions for the dashboard E2E tests.
// We prefer role/text selectors; the global FilterBar uses native <select>s with
// no associated <label>, so we identify each select by an option unique to it.

/** The global Location/warehouse filter (identified by its "San Francisco" option). */
function locationFilter(page) {
  return page.locator('select', { has: page.locator('option', { hasText: 'San Francisco' }) })
}

/** The global Category filter (identified by its "Circuit Boards" option). */
function categoryFilter(page) {
  return page.locator('select', { has: page.locator('option', { hasText: 'Circuit Boards' }) })
}

/**
 * Switch the UI language via the header language switcher.
 * Tests start in a fresh context (default locale = English), so the toggle
 * button is labelled with the current language; clicking it reveals the menu.
 */
async function switchLanguage(page, optionLabel) {
  await page.getByRole('button', { name: /^(English|日本語)$/ }).first().click()
  await page.getByRole('button', { name: optionLabel, exact: true }).click()
}

module.exports = { locationFilter, categoryFilter, switchLanguage }
