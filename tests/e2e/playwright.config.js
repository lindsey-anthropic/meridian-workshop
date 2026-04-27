import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for Meridian critical-flow tests (RFP R3 / proposal section 3.3).
 * Runs against localhost:3000 (frontend) and localhost:8001 (backend).
 * Both servers must be up before invoking; CI uses the workflow at .github/workflows/ci.yml.
 */
export default defineConfig({
  testDir: './specs',
  fullyParallel: false, // Mock data is mutated by Issue PO; serial avoids cross-spec leaks.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
