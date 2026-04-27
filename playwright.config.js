import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 15000,
  expect: { timeout: 5000 },
  use: {
    baseURL: 'http://localhost:3000',
    headless: true
  },
  reporter: [['list'], ['html', { outputFolder: 'tests/e2e/report', open: 'never' }]]
})
