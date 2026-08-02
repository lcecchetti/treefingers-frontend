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
  // StoryNewPage passes the raw `forest` query param straight through to StoryNew,
  // which filters QUERY_CHOOSE_FOREST by `{ id: { eq: forest } }` - since only the
  // forest's name (not its id) is available here, that filter matches nothing and
  // leaves the required "forest" field disabled forever. Skip the query param and
  // use the visible "Search..." field instead, which filters by name (`ilike`) and
  // auto-selects the first (only) match - see story-lifecycle.spec.ts.
  await page.goto('/story/new');
  await page.getByLabel('Title').fill(uniqueTitle);
  await page.getByLabel('Content').fill('Content for the search E2E test.');
  await page.getByPlaceholder('Search...').fill(forestName);
  await expect(page.getByRole('combobox')).toBeEnabled();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Story planted!')).toBeVisible();

  await page.goto(`/search?q=${uniqueTitle}`);
  // The search page's intro text ("Here is all we could find for {query}:") also
  // contains uniqueTitle as a substring, so a page-wide getByText(uniqueTitle)
  // matches two elements. Scope to the story card's own title, which renders as
  // a Text variant="title" (an <h2>, i.e. ARIA role "heading") - confirmed against
  // components/story/story-card.tsx and components/ui/text.tsx.
  await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
});
