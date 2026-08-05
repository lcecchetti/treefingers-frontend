import { test, expect } from '@playwright/test';
import { createActivatedUser } from './support/test-user';

async function loginAs(page: import('@playwright/test').Page, user: { username: string; email: string; password: string }) {
  await page.goto('/auth/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
  // Landing URL is non-deterministic (login-form.tsx has a redirect race), so
  // assert the welcome toast plus having left /auth/login instead.
  await expect(page.getByText(`Hey ${user.username}, welcome!`)).toBeVisible();
  await expect(page).not.toHaveURL(/\/auth\/login/);
}

test('a user can search and land on results containing a story they created', async ({ page, request }) => {
  const user = await createActivatedUser(request);
  await loginAs(page, user);

  const forestName = `e2e${Date.now()}`.slice(0, 20);
  await page.goto('/forest/new');
  await page.getByLabel('Name').fill(forestName);
  await page.getByLabel('About').fill('Forest for a search E2E test.');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page).toHaveURL(new RegExp(`/forest/${forestName}$`));

  const uniqueTitle = `Findable${Date.now()}`;
  // Skip the `forest` query param (filters by id, but we only have the name)
  // and use the "Search..." field instead - see story-lifecycle.spec.ts.
  await page.goto('/story/new');
  await page.getByLabel('Title').fill(uniqueTitle);
  await page.getByLabel('Content').fill('Content for the search E2E test.');
  await page.getByPlaceholder('Search...').fill(forestName);
  await expect(page.getByRole('combobox')).toBeEnabled();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Story planted!')).toBeVisible();

  await page.goto(`/search?q=${uniqueTitle}`);
  // The page's intro text also contains uniqueTitle, so scope to the card's heading.
  await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
});
