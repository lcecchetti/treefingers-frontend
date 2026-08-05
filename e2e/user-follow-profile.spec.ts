import { test, expect } from '@playwright/test';
import { createActivatedUser } from './support/test-user';

async function loginAs(page: import('@playwright/test').Page, user: { username: string; email: string; password: string }) {
  await page.goto('/auth/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
  // See forest-lifecycle.spec.ts: login-form.tsx races two router.push calls after
  // login, so the landing URL is non-deterministic. Assert the welcome toast (proof
  // the login mutation succeeded) and that we've left /auth/login instead.
  await expect(page.getByText(`Hey ${user.username}, welcome!`)).toBeVisible();
  await expect(page).not.toHaveURL(/\/auth\/login/);
}

test('a user can follow another user and see them in followed-users', async ({ page, request }) => {
  const follower = await createActivatedUser(request);
  const followed = await createActivatedUser(request);

  await loginAs(page, follower);
  await page.goto(`/user/${followed.username}`);

  // UserFollowership is an icon-only toggle with no wrapping <button>, sitting as
  // a sibling of the username Text; go up one level to find its svg.
  await expect(page.getByText(followed.username)).toBeVisible();
  await page.getByText(followed.username).locator('..').locator('svg').click();

  await page.goto('/profile/followed-users');
  await expect(page.getByText(followed.username)).toBeVisible();
});

test("a logged-in user can view their own profile pages without errors", async ({ page, request }) => {
  const user = await createActivatedUser(request);
  await loginAs(page, user);

  for (const path of ['/profile/me', '/profile/details', '/profile/my-stories', '/profile/my-forests', '/profile/liked-stories', '/profile/liked-chapters', '/profile/joined-forests']) {
    await page.goto(path);
    await expect(page.getByText(/error/i)).not.toBeVisible();
  }
});
