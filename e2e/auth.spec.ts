import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('#username', 'admin');
    // For p-password, it's safer to use the input selector
    await page.fill('p-password input', 'admin123');

    // Click login button
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h2')).toContainText('Dashboard Overview');
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('#username', 'wronguser');
    await page.fill('p-password input', 'wrongpass');
    await page.click('button[type="submit"]');

    // Should show error message
    const errorMsg = page.locator('p-message');
    await expect(errorMsg).toBeVisible();
  });
});
