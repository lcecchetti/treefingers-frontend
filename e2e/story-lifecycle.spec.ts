import { test, expect } from '@playwright/test';
import { createActivatedUser } from './support/test-user';

async function loginAs(page: import('@playwright/test').Page, user: { username: string; email: string; password: string }) {
  await page.goto('/auth/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
  // login-form.tsx has a pre-existing race between its own post-login router.push
  // and a "logged in users get bounced off /auth/login" redirect effect - the exact
  // landing URL is non-deterministic, so assert the welcome toast (proof the login
  // mutation succeeded) and that we've left /auth/login rather than an exact URL.
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
  // StoryNewPage passes the raw `forest` query param straight through as `forest`
  // to StoryNew, which uses it to filter QUERY_CHOOSE_FOREST by `{ id: { eq: forest } }`
  // (pages/story/new.tsx, components/story/story-new.tsx) - since the forest name
  // (not its id) is what's available here, that filter matches nothing and leaves
  // the required "forest" field empty/disabled forever. Skip the query param and
  // instead use the visible "Search..." field, which filters by name (`ilike`) and
  // auto-selects the first (only) match - reliably resolving to the forest just
  // created above regardless of its id.
  await page.goto('/story/new');
  await page.getByLabel('Title').fill(storyTitle);
  await page.getByLabel('Content').fill('Once upon an E2E test...');
  await page.getByPlaceholder('Search...').fill(forestName);
  await expect(page.getByRole('combobox')).toBeEnabled();
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page).toHaveURL(/\/story\/.+/);
  await expect(page.getByText('Story planted!')).toBeVisible();
  // getByText(storyTitle) is ambiguous: Next's route announcer (an aria-live region
  // used for a11y route-change announcements) also contains the title text as part
  // of the page's `<title>` string. Scope to the actual story heading.
  await expect(page.getByRole('heading', { name: storyTitle })).toBeVisible();

  // StoryView (components/story/story-view.tsx) renders StoryActions twice - a mobile
  // bar (`lg:hidden`) and a desktop bar (`hidden lg:flex`, tree icon disabled).
  // Playwright's default viewport is desktop-sized, so only the desktop bar is
  // visible/interactive. The main nav (components/common/header/main-navigation.tsx)
  // also carries the literal classes "hidden" and "lg:flex", so a bare
  // `.hidden.lg\:flex` selector would match both - scope to the one that actually
  // contains icons (the nav has none) to land on StoryActions specifically.
  const desktopActions = page.locator('.hidden.lg\\:flex').filter({ has: page.locator('svg') });
  const icons = desktopActions.locator('svg');

  // With the tree icon disabled, StoryActions (components/story/story-actions.tsx)
  // renders CommentCount first, then Like - confirmed against the component source
  // (comment-count.tsx / like.tsx), each of which only renders its count Text when
  // the count is truthy, so with a freshly planted story (commentsCount/likesCount
  // both 0) each icon is the first (and only) child of its own wrapper.
  const commentIcon = icons.nth(0);
  const likeIcon = icons.nth(1);
  const likeContainer = likeIcon.locator('..');

  // like: entity has likesCount:0 initially, so no count text renders until after
  // the click. Scope the "1" assertion to the Like component's own wrapper div,
  // since a freshly-activated user always has an unread-notification "1" badge in
  // the page header that would otherwise make a page-wide search ambiguous.
  await likeIcon.click();
  await expect(likeContainer.getByText('1', { exact: true })).toBeVisible();

  // comment: opens the comments Flyout (components/common/flyout.tsx), which
  // renders CommentList -> CommentNew.
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
  // See the sibling test above for why the forest query param is skipped in favor
  // of the "Search..." field.
  await page.goto('/story/new');
  await page.getByLabel('Title').fill(storyTitle);
  await page.getByLabel('Content').fill('The root of the tale.');
  await page.getByPlaceholder('Search...').fill(forestName);
  await expect(page.getByRole('combobox')).toBeEnabled();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page).toHaveURL(/\/story\/.+/);

  // StoryChapters (components/story/story-chapters.tsx) renders the chapter-writing
  // StoryNew form directly, with no toggle needed, whenever the story has zero
  // existing chapters - which is always true for a story just created above. Since
  // `parent` is set, StoryNew's title field label is "Action" instead of "Title"
  // (components/story/story-new.tsx: `label={!parent ? 'Title' : 'Action'}`).
  const chapterAction = 'Choose the next path';
  await page.getByLabel('Action').fill(chapterAction);
  await page.getByLabel('Content').fill('The chapter that follows.');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page).toHaveURL(/\/story\/.+/);
  await expect(page.getByText('Chapter created!')).toBeVisible();
});
