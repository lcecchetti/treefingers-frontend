import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logoutSession } from './logout';

describe('logoutSession', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
  });

  it('POSTs a logout mutation to the GraphQL endpoint with credentials included', async () => {
    await logoutSession();

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = vi.mocked(fetch).mock.calls[0];

    expect(url).toBe('http://localhost:4000/graphql');
    expect(init).toMatchObject({ method: 'POST', credentials: 'include' });
    expect(JSON.parse(init!.body as string).query).toContain('logout');
  });

  it('resolves without throwing even if the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    await expect(logoutSession()).resolves.toBeUndefined();
  });
});
