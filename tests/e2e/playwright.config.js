// @ts-check
const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './specs',
  timeout: 15000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  reporter: 'list',
})
