const { test, expect } = require('@playwright/test')

// Covers the /api/tasks backend implemented during R1: create -> toggle -> delete,
// driven through the real profile-menu UI.
test.describe('Tasks (create / toggle / delete)', () => {
  test('a task can be added, completed, and removed', async ({ page }) => {
    await page.goto('/')

    const title = `E2E Task ${Date.now()}`

    // Open the profile menu and the Tasks modal
    await page.getByRole('button', { name: /John Doe/ }).click()
    await page.getByRole('button', { name: /My Tasks/ }).click()
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible()

    // Add a uniquely-named task
    await page.locator('#task-title').fill(title)
    await page.locator('#task-due-date').fill('2026-12-31')
    await page.getByRole('button', { name: 'Add Task' }).click()

    const item = page.locator('.task-item', { hasText: title })
    await expect(item).toBeVisible()

    // Toggle it complete
    await item.locator('.task-checkbox').check()
    await expect(item).toHaveClass(/completed/)

    // Delete it
    await item.locator('.task-delete-btn').click()
    await expect(page.getByText(title)).toHaveCount(0)
  })
})
