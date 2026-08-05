import { test, expect } from '@playwright/test';
import { createActivatedUser } from './support/test-user';

async function loginAs(page: import('@playwright/test').Page, user: { username: string; email: string; password: string }) {
  await page.goto('/auth/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
  // Landing URL is non-deterministic (login-form.tsx has a redirect race between
  // '/' and '/profile/me'), so assert the welcome toast and leaving /auth/login
  // instead of a specific destination.
  await expect(page.getByText(`Hey ${user.username}, welcome!`)).toBeVisible();
  await expect(page).not.toHaveURL(/\/auth\/login/);
}

test('a user can create a forest, view it, join it, then leave it', async ({ page, request }) => {
  const user = await createActivatedUser(request);
  await loginAs(page, user);

  const forestName = `e2e${Date.now()}`.slice(0, 20);

  await page.goto('/forest/new');
  await page.getByLabel('Name').fill(forestName);
  await page.getByLabel('About').fill('An E2E test forest.');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page).toHaveURL(new RegExp(`/forest/${forestName}$`));
  await expect(page.getByText(`${forestName} created!`)).toBeVisible();

  // Creator is NOT auto-joined (ForestNew's onCompleted only redirects), so
  // membersCount starts at 0. "Plant" renders as <a>, giving it role "link".
  // svg order in its shared flex container: Plant's icon (0), CommentCount (1),
  // ForestMembership (2).
  const actionsRow = page.getByRole('link', { name: 'Plant' }).locator('..');
  const membershipIcon = actionsRow.locator('svg').nth(2);
  // Scoped to ForestMembership's own wrapper div, since the page header can
  // independently show unrelated "1" badges.
  const membershipContainer = membershipIcon.locator('..');

  await expect(membershipContainer.getByText('1', { exact: true })).toHaveCount(0);

  await membershipIcon.click();
  await expect(membershipContainer.getByText('1', { exact: true })).toBeVisible(); // membersCount after joining

  await membershipIcon.click();
  await expect(membershipContainer.getByText('1', { exact: true })).not.toBeVisible(); // membersCount after leaving
});
