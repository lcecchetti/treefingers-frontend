import type { APIRequestContext } from '@playwright/test';
import { Client } from 'pg';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';

// Activation/reset links are JWTs the backend mints for a real email it sends;
// with no dev inbox to read from, tests mint an identical token themselves
// using the same secret, read from the sibling treefingers-backend repo's .env.
//
// Walk upward from this file to find `treefingers-backend` rather than
// hardcoding a `..` depth, since this repo may be checked out directly or
// inside a git worktree.
function findBackendEnvPath(): string {
  let dir = path.dirname(__dirname); // start above e2e/support
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
// Also load the app's own .env.local so this fixture talks to the same
// backend the browser under test does.
dotenv.config({ path: path.resolve(__dirname, '../../.env.local'), quiet: true });

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? 'http://localhost:3001/graphql';
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

if (!JWT_SECRET || !DATABASE_URL) {
  throw new Error(
    'E2E tests need JWT_SECRET and DATABASE_URL from treefingers-backend/.env to mint activation/reset tokens. ' +
    'Make sure treefingers-backend is checked out as a sibling directory with a populated .env.'
  );
}

export interface TestUserCredentials {
  email: string;
  username: string;
  password: string;
  bio: string;
}

export interface ActivatedTestUser extends TestUserCredentials {
  id: number;
}

export function generateTestUser(): TestUserCredentials {
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    email: `e2e-${unique}@example.com`,
    username: `e2e${unique}`.slice(0, 20),
    password: 'Sup3rSecret!',
    bio: 'Created by an E2E test',
  };
}

async function graphqlRequest(request: APIRequestContext, query: string, variables: Record<string, unknown>) {
  const response = await request.post(GRAPHQL_ENDPOINT, { data: { query, variables } });
  const body = await response.json();

  if (body.errors?.length) {
    throw new Error(`GraphQL request failed: ${body.errors[0].message}`);
  }

  return body.data;
}

export async function registerViaApi(request: APIRequestContext, user: TestUserCredentials): Promise<void> {
  await graphqlRequest(
    request,
    `mutation register($input: RegisterInput!) { register(input: $input) { result } }`,
    { input: { data: { email: user.email, username: user.username, password: user.password, bio: user.bio } } }
  );
}

async function fetchUserRow(email: string): Promise<{ id: number; tokenVersion: number }> {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query<{ id: number; token_version: number }>(
      'SELECT id, token_version FROM "user" WHERE email = $1',
      [email]
    );

    if (!result.rows.length) {
      throw new Error(`No user found for email ${email} - did registration fail?`);
    }

    return { id: result.rows[0].id, tokenVersion: result.rows[0].token_version };
  } finally {
    await client.end();
  }
}

export function mintActivateToken(userId: number): string {
  return jwt.sign({ sub: userId, type: 'activate' }, JWT_SECRET as string, { expiresIn: '1d' });
}

export function mintResetToken(userId: number, tokenVersion: number): string {
  return jwt.sign({ sub: userId, tokenVersion, type: 'reset' }, JWT_SECRET as string, { expiresIn: '15m' });
}

export async function activateViaApi(request: APIRequestContext, token: string): Promise<void> {
  await graphqlRequest(
    request,
    `mutation activateAccount($input: ActivateAccountInput!) { activateAccount(input: $input) { result } }`,
    { input: { token } }
  );
}

export async function createActivatedUser(request: APIRequestContext): Promise<ActivatedTestUser> {
  const user = generateTestUser();
  await registerViaApi(request, user);
  const { id } = await fetchUserRow(user.email);
  await activateViaApi(request, mintActivateToken(id));
  return { ...user, id };
}

export async function getResetTokenFor(email: string): Promise<string> {
  const { id, tokenVersion } = await fetchUserRow(email);
  return mintResetToken(id, tokenVersion);
}
