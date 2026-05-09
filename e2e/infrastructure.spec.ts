import { test, expect } from '@playwright/test';

test.describe('Infrastructure Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('p-password input', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate to bus list and open add dialog', async ({ page }) => {
    // Navigate to buses
    // The sidebar might use routerLink or a button. Let's assume there's a link.
    await page.goto('/buses');
    
    await expect(page.locator('h2')).toContainText('Quản lý Xe Buýt');

    // Click "Thêm mới" button
    await page.click('button:has-text("Thêm mới")');

    // Dialog should be visible
    const dialog = page.locator('p-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Chi tiết Xe Buýt');

    // Fill some data
    await page.fill('#licensePlate', '29A-TEST-123');
    
    // Close dialog
    await page.click('button:has-text("Hủy")');
    await expect(dialog).not.toBeVisible();
  });

  test('should toggle dark mode from navbar', async ({ page }) => {
    await page.goto('/dashboard');
    
    const html = page.locator('html');
    
    // Check initial theme (default is dark as per my ThemeService)
    await expect(html).toHaveClass(/dark/);
    
    // Click theme toggle in navbar
    // Based on navbar.html: <button class="icon-btn" (click)="toggleTheme()" ...>
    // It's the first icon-btn or has a specific title
    const themeBtn = page.locator('button.icon-btn').first();
    await themeBtn.click();
    
    // Should be light mode
    await expect(html).not.toHaveClass(/dark/);
    
    // Toggle back
    await themeBtn.click();
    await expect(html).toHaveClass(/dark/);
  });
});
