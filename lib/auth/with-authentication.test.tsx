import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { withAuthentication } from './with-authentication';
import type { NextPageWithLayout } from '@/lib/types/next';

const replaceMock = vi.fn();
vi.mock('next/router', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

const ProtectedPage: NextPageWithLayout = () => <div>secret content</div>;
const Secured = withAuthentication(ProtectedPage);

describe('withAuthentication', () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  it('shows a spinner and redirects to login when there is no current user', async () => {
    const mocks = [{ request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: null } } }];
    renderWithProviders(<Secured />, { mocks });

    expect(await screen.findByText('Authenticating...')).toBeInTheDocument();
    await vi.waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/auth/login'));
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  });

  it('renders the wrapped page when there is a current user', async () => {
    const mocks = [{
      request: { query: QUERY_CURRENT_USER },
      result: { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } },
    }];
    renderWithProviders(<Secured />, { mocks });

    expect(await screen.findByText('secret content')).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
