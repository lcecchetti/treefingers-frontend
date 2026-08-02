import { test, expect } from '@playwright/test';
import { generateTestUser } from './support/test-user';
import { Client } from 'pg';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';

// activation links are JWTs the backend signs with its own JWT_SECRET and embeds in a
// real email it sends - there's no dev inbox to read that email from, so this test mints
// an identical token directly using the same secret, read from the sibling
// treefingers-backend repo's .env (local-only setup). See e2e/support/test-user.ts for
// the same pattern used by the API-driven fixtures.
function findBackendEnvPath(): string {
  let dir = path.dirname(__dirname); // start above e2e/
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, 'treefingers-backend', '.env');
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    'Could not find a treefingers-backend/.env above this file. ' +
    'Make sure treefingers-backend is checked out as a sibling of the frontend workspace (or its enclosing worktree checkout).'
  );
}

dotenv.config({ path: findBackendEnvPath(), quiet: true });

const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

if (!JWT_SECRET || !DATABASE_URL) {
  throw new Error(
    'E2E tests need JWT_SECRET and DATABASE_URL from treefingers-backend/.env to mint activation tokens. ' +
    'Make sure treefingers-backend is checked out as a sibling directory with a populated .env.'
  );
}

async function activationLinkFor(email: string): Promise<string> {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    const { rows } = await client.query<{ id: number }>('SELECT id FROM "user" WHERE email = $1', [email]);

    if (!rows.length) {
      throw new Error(`No user found for email ${email} - did registration fail?`);
    }

    const token = jwt.sign({ sub: rows[0].id, type: 'activate' }, JWT_SECRET as string, { expiresIn: '1d' });
    return `/auth/activate-account/${token}`;
  } finally {
    await client.end();
  }
}

test('a new user can register, activate their account, log in, and log out', async ({ page }) => {
  const user = generateTestUser();

  await page.goto('/auth/register');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password', { exact: true }).fill(user.password);
  await page.getByLabel('Confirm password').fill(user.password);
  await page.getByLabel('Username').fill(user.username);
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByText(/Check your emails to activate your account/i)).toBeVisible();

  await page.goto(await activationLinkFor(user.email));
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByText(/Your account is now active/i)).toBeVisible();

  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();

  // login-form.tsx's onCompleted races its own router.push(redirect) to '/' against a
  // "logged in users get bounced off /auth/login" effect in the same component that
  // fires router.push('/profile/me') once the post-login currentUser cache update
  // lands - whichever router.push resolves last wins client-side navigation. That
  // makes the exact landing URL non-deterministic; waiting for the welcome toast
  // (proof the login mutation itself succeeded) and asserting we've left the login
  // page - rather than asserting a specific destination - avoids depending on that
  // pre-existing app-level race (see e2e/forest-lifecycle.spec.ts's loginAs helper).
  await expect(page.getByText(`Hey ${user.username}, welcome!`)).toBeVisible();
  await expect(page).not.toHaveURL(/\/auth\/login/);

  // pages/auth/logout.tsx fires logoutSession() + client.resetStore() immediately on
  // mount (no click needed) and redirects to '/' when done
  await page.goto('/auth/logout');
  await expect(page).toHaveURL('/');

  await page.goto('/profile/me');
  await expect(page).toHaveURL(/\/auth\/login/);
});
