import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  webServer: {
    command: 'echo "Assuming servers are already running"',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
})
