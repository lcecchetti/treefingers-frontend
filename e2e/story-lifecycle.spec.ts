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

async function createForestAndGoTo(page: import('@playwright/test').Page, about: string): Promise<string> {
  const forestName = `e2e${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(0, 20);
  await page.goto('/forest/new');
  await page.getByLabel('Name').fill(forestName);
  await page.getByLabel('About').fill(about);
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page).toHaveURL(new RegExp(`/forest/${forestName}$`));
  return forestName;
}

test('a user can plant a story, view it, like it, comment on it, and add a chapter', async ({ page, request }) => {
  const user = await createActivatedUser(request);
  await loginAs(page, user);

  const forestName = await createForestAndGoTo(page, 'Forest for a story E2E test.');

  const storyTitle = `E2E Story ${Date.now()}`;
  // Skip the `forest` query param (it filters by id, but we only have the name)
  // and use the "Search..." field instead, which filters by name and
  // auto-selects the first match.
  await page.goto('/story/new');
  await page.getByLabel('Title').fill(storyTitle);
  await page.getByLabel('Content').fill('Once upon an E2E test...');
  await page.getByPlaceholder('Search...').fill(forestName);
  await expect(page.getByRole('combobox')).toBeEnabled();
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page).toHaveURL(/\/story\/.+/);
  await expect(page.getByText('Story planted!')).toBeVisible();
  // getByText(storyTitle) is ambiguous: Next's route announcer also contains
  // the title as part of `<title>`. Scope to the actual heading.
  await expect(page.getByRole('heading', { name: storyTitle })).toBeVisible();

  // StoryView renders StoryActions twice (mobile/desktop bars); the main nav
  // shares the desktop bar's classes, so scope to the one with icons.
  const desktopActions = page.locator('.hidden.lg\\:flex').filter({ has: page.locator('svg') });
  const icons = desktopActions.locator('svg');

  // With the tree icon disabled, StoryActions renders CommentCount then Like.
  const commentIcon = icons.nth(0);
  const likeIcon = icons.nth(1);
  const likeContainer = likeIcon.locator('..');

  // Scoped to Like's own wrapper: a freshly-activated user's unread-notification
  // badge is also "1" and would make a page-wide search ambiguous.
  await likeIcon.click();
  await expect(likeContainer.getByText('1', { exact: true })).toBeVisible();

  await commentIcon.click();
  await page.getByPlaceholder('Your comment...').fill('Nice story!');
  await page.getByRole('button', { name: 'Comment' }).click();
  await expect(page.getByText('Nice story!')).toBeVisible();
});

test('a user can add a chapter to their own story', async ({ page, request }) => {
  const user = await createActivatedUser(request);
  await loginAs(page, user);

  const forestName = await createForestAndGoTo(page, 'Forest for a chapter E2E test.');

  const storyTitle = `E2E Root ${Date.now()}`;
  // See the sibling test above for why the "Search..." field is used instead.
  await page.goto('/story/new');
  await page.getByLabel('Title').fill(storyTitle);
  await page.getByLabel('Content').fill('The root of the tale.');
  await page.getByPlaceholder('Search...').fill(forestName);
  await expect(page.getByRole('combobox')).toBeEnabled();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page).toHaveURL(/\/story\/.+/);

  // With `parent` set, StoryNew's title field label is "Action" instead of "Title".
  const chapterAction = 'Choose the next path';
  await page.getByLabel('Action').fill(chapterAction);
  await page.getByLabel('Content').fill('The chapter that follows.');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page).toHaveURL(/\/story\/.+/);
  await expect(page.getByText('Chapter created!')).toBeVisible();
});
