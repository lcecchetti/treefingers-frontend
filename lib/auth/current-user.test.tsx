import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { useCurrentUser, QUERY_CURRENT_USER } from './current-user';

function wrapper(mocks: MockedResponse[]) {
  return ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
}

describe('useCurrentUser', () => {
  it('starts loading and then returns the current user', async () => {
    const mocks: MockedResponse[] = [{
      request: { query: QUERY_CURRENT_USER },
      result: { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } },
    }];

    const { result } = renderHook(() => useCurrentUser(), { wrapper: wrapper(mocks) });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.currentUser).toEqual({ id: '1', email: 'a@b.com', username: 'alice' });
  });

  it('resolves to an undefined user when the query returns null (logged out)', async () => {
    const mocks: MockedResponse[] = [{
      request: { query: QUERY_CURRENT_USER },
      result: { data: { currentUser: null } },
    }];

    const { result } = renderHook(() => useCurrentUser(), { wrapper: wrapper(mocks) });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.currentUser).toBeNull();
  });
});
