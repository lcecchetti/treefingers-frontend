import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth/logout', () => ({
  logoutSession: vi.fn().mockResolvedValue(undefined),
}));

import { handleAuthError } from './client';
import { logoutSession } from '@/lib/auth/logout';

function unauthenticatedError(operationName: string) {
  return {
    graphQLErrors: [{ extensions: { code: 'UNAUTHENTICATED' } }],
    operation: { operationName },
  } as unknown as Parameters<typeof handleAuthError>[0];
}

// jsdom defines window.location.assign as a non-configurable own property,
// so vi.spyOn(window.location, 'assign') throws "Cannot redefine property".
// window.location itself is a configurable accessor though, so swap it for a
// stand-in whose pathname delegates to the real (live) Location -- keeping it
// in sync with history.pushState -- while assign is a plain mock.
const realLocation = window.location;
const assign = vi.fn();

describe('handleAuthError', () => {
  beforeEach(() => {
    vi.mocked(logoutSession).mockClear();
    assign.mockClear();
    window.history.pushState({}, '', '/story/42');
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        get pathname() {
          return realLocation.pathname;
        },
        assign,
      },
    });
  });

  it('logs out and redirects to login on a session-rejected error outside /auth', async () => {
    handleAuthError(unauthenticatedError('someQuery'));
    await vi.waitFor(() => expect(logoutSession).toHaveBeenCalledTimes(1));

    expect(assign).toHaveBeenCalledWith('/auth/login?redirect=%2Fstory%2F42');
  });

  it('does nothing for changePassword, which validates its own token', async () => {
    handleAuthError(unauthenticatedError('changePassword'));
    await new Promise((r) => setTimeout(r, 0));

    expect(logoutSession).not.toHaveBeenCalled();
  });

  it('does nothing for activateAccount, which validates its own token', async () => {
    handleAuthError(unauthenticatedError('activateAccount'));
    await new Promise((r) => setTimeout(r, 0));

    expect(logoutSession).not.toHaveBeenCalled();
  });

  it('does nothing when already on an /auth page', async () => {
    window.history.pushState({}, '', '/auth/login');
    handleAuthError(unauthenticatedError('currentUser'));
    await new Promise((r) => setTimeout(r, 0));

    expect(logoutSession).not.toHaveBeenCalled();
  });

  it('does nothing for a non-UNAUTHENTICATED error code', async () => {
    handleAuthError({
      graphQLErrors: [{ extensions: { code: 'FORBIDDEN' } }],
      operation: { operationName: 'someQuery' },
    } as unknown as Parameters<typeof handleAuthError>[0]);
    await new Promise((r) => setTimeout(r, 0));

    expect(logoutSession).not.toHaveBeenCalled();
  });
});
