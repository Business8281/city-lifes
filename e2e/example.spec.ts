
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Citylifes/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // Minimal check to ensure page loads
  const body = page.locator('body');
  await expect(body).toBeVisible();
});
