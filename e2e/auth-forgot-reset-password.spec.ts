import { test, expect } from '@playwright/test';
import { createActivatedUser, getResetTokenFor } from './support/test-user';

test('a user can reset their password via a minted reset link and log in with the new one', async ({ page, request }) => {
  const user = await createActivatedUser(request);
  const newPassword = 'BrandNewPassword1';

  const resetToken = await getResetTokenFor(user.email);
  await page.goto(`/auth/change-password/${resetToken}`);

  await page.getByLabel('Password', { exact: true }).fill(newPassword);
  await page.getByLabel('Confirm password').fill(newPassword);
  await page.getByRole('button', { name: 'Update password' }).click();

  await expect(page).toHaveURL(/\/auth\/login/);

  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(newPassword);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText(`Hey ${user.username}, welcome!`)).toBeVisible();
});

test('the forgot-password form accepts an email without revealing whether it exists', async ({ page }) => {
  await page.goto('/auth/forgot-password');
  await page.getByLabel('Email').fill('nobody-e2e@example.com');
  await page.getByRole('button', { name: 'Send email' }).click();

  await expect(page.getByText(/we've sent a reset link/i)).toBeVisible();
});
