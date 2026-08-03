import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { AuthRequired } from './auth-required';

vi.mock('next/navigation', () => ({
  usePathname: () => '/story/new',
  useSearchParams: () => new URLSearchParams(),
}));

describe('AuthRequired', () => {
  it('shows a login prompt instead of children when logged out', async () => {
    const mocks = [{ request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: null } } }];
    renderWithProviders(<AuthRequired><div>protected</div></AuthRequired>, { mocks });

    expect(await screen.findByText(/not logged in/i)).toBeInTheDocument();
    expect(screen.queryByText('protected')).not.toBeInTheDocument();
  });

  it('renders children when logged in', async () => {
    const mocks = [{
      request: { query: QUERY_CURRENT_USER },
      result: { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } },
    }];
    renderWithProviders(<AuthRequired><div>protected</div></AuthRequired>, { mocks });

    expect(await screen.findByText('protected')).toBeInTheDocument();
  });

  it('renders a custom prompt message when given one', async () => {
    const mocks = [{ request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: null } } }];
    renderWithProviders(<AuthRequired text="Custom prompt">protected</AuthRequired>, { mocks });

    expect(await screen.findByText('Custom prompt')).toBeInTheDocument();
  });
});
