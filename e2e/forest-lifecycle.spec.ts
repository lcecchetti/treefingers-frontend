import { test, expect } from '@playwright/test';
import { createActivatedUser } from './support/test-user';

async function loginAs(page: import('@playwright/test').Page, user: { username: string; email: string; password: string }) {
  await page.goto('/auth/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
  // login-form.tsx's onCompleted races its own router.push(redirect) to '/' against a
  // "logged in users get bounced off /auth/login" effect in the same component that
  // fires router.push('/profile/me') once the post-login currentUser cache update
  // lands - whichever router.push resolves last wins client-side navigation. That
  // makes the exact landing URL non-deterministic (observed both '/' and
  // '/profile/me' across repeated real-backend runs); waiting for the welcome toast
  // (proof the login mutation itself succeeded) and asserting we've left the login
  // page - rather than asserting a specific destination - avoids depending on that
  // pre-existing app-level race. The caller navigates to /forest/new next regardless
  // of which authenticated page we land on.
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

  // ForestNew's onCompleted only redirects - it never calls the join mutation - so
  // the creator is NOT auto-joined; membersCount starts at 0 (no count text renders
  // at all, since ForestActions/ForestMembership only show the number when truthy).
  //
  // The "Plant" button is rendered as <Button as={Link}>, which produces a plain
  // <a href> - that gets an implicit ARIA role of "link", not "button" (verified
  // against the real rendered DOM; getByRole('button', {name: 'Plant'}) matches 0
  // elements). It shares a flex container with ForestActions (forest-view.tsx);
  // within that container, svg order is: Plant's own icon (0), CommentCount's
  // icon (1), ForestMembership's icon (2) - confirmed against the real rendered
  // markup, matching the plan's assumption.
  const actionsRow = page.getByRole('link', { name: 'Plant' }).locator('..');
  const membershipIcon = actionsRow.locator('svg').nth(2);
  // ForestMembership renders its optional count Text and its icon inside the same
  // wrapping div - scope assertions to that div rather than the whole page, since
  // the page header can independently show unrelated "1" badges (e.g. notification
  // counts) that would make a page-wide text search for "1" unreliable.
  const membershipContainer = membershipIcon.locator('..');

  await expect(membershipContainer.getByText('1', { exact: true })).toHaveCount(0);

  await membershipIcon.click();
  await expect(membershipContainer.getByText('1', { exact: true })).toBeVisible(); // membersCount after joining

  await membershipIcon.click();
  await expect(membershipContainer.getByText('1', { exact: true })).not.toBeVisible(); // membersCount after leaving
});
