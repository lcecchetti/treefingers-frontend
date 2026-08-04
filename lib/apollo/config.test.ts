import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({ toString: () => 'session=abc' }),
}));

import { createServerFetch } from './config';
import { cookies } from 'next/headers';

// createServerFetch's cookie-forwarding branch only runs server-side; jsdom
// defines `window`, so simulate an RSC render by removing it for the
// duration of each test.
const originalWindow = globalThis.window;

beforeEach(() => {
  // @ts-expect-error simulating a server (non-browser) environment
  delete globalThis.window;
  vi.mocked(cookies).mockClear();
});

afterEach(() => {
  globalThis.window = originalWindow;
});

describe('createServerFetch', () => {
  it('forwards the session cookie when forwardCookies is true', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null))
    );

    const serverFetch = createServerFetch(true);
    await serverFetch('http://localhost:4000/graphql', {});

    expect(cookies).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/graphql',
      expect.objectContaining({ headers: expect.objectContaining({ cookie: 'session=abc' }) })
    );

    vi.unstubAllGlobals();
  });

  it('never reads cookies when forwardCookies is false, so callers stay static/ISR-eligible', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null))
    );

    const serverFetch = createServerFetch(false);
    await serverFetch('http://localhost:4000/graphql', {});

    expect(cookies).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/graphql', {});

    vi.unstubAllGlobals();
  });
});
