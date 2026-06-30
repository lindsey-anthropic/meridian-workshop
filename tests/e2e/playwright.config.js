// Playwright configuration for Meridian inventory dashboard E2E tests (R3).
// Runs headless against the running dev frontend (localhost:3000), which in turn
// talks to the backend on localhost:8001. Override the target with BASE_URL.
const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  // Each spec file runs in parallel; tests within a file share a worker.
  fullyParallel: true,
  // Fail the build if a test was accidentally left as test.only in CI.
  forbidOnly: !!process.env.CI,
  // Flaky-network resilience in CI; no retries locally so failures are obvious.
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
