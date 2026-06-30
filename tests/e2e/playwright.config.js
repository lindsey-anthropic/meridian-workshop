// @ts-check
const { defineConfig, devices } = require('@playwright/test')

/**
 * E2E configuration for the Meridian inventory dashboard.
 *
 * Tests run against the running frontend at http://localhost:3000 (which talks
 * to the FastAPI backend on :8001). If the servers are already up, the suite
 * reuses them; otherwise `webServer` starts both via scripts/start.sh — so this
 * works both locally and in CI.
 */
module.exports = defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: 'bash scripts/start.sh',
    cwd: '../..',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000
  }
})
