const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  reporter: [['list'], ['html', { outputFolder: 'tests/e2e/report', open: 'never' }]],
})
