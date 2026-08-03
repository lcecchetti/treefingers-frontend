import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { Toasts } from '@/components/common';
import { RegisterForm } from './register-form';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams(),
}));

const MUTATION_REGISTER = graphql(`
  mutation register($input: RegisterInput!) {
    register(input: $input) {
      result
    }
  }
`);

const loggedOutCurrentUser = {
  request: { query: QUERY_CURRENT_USER },
  result: { data: { currentUser: null } },
};

describe('RegisterForm', () => {
  it('rejects a password shorter than 10 characters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />, { mocks: [loggedOutCurrentUser] });

    await user.type(screen.getByLabelText('Password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Too short!')).toBeInTheDocument();
  });

  it('rejects mismatched password confirmation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />, { mocks: [loggedOutCurrentUser] });

    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password456');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('Passwords must match')).toBeInTheDocument();
  });

  it('registers and redirects to login on success', async () => {
    const user = userEvent.setup();
    const mocks = [
      loggedOutCurrentUser,
      {
        request: {
          query: MUTATION_REGISTER,
          variables: { input: { data: { email: 'a@b.com', password: 'password123', username: 'alice', bio: '' } } },
        },
        result: { data: { register: { result: true } } },
      },
    ];

    renderWithProviders(<><RegisterForm /><Toasts /></>, { mocks });

    await user.type(screen.getByLabelText('Email'), 'a@b.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await screen.findByText(/Check your emails to activate your account/i, {}, { timeout: 3000 });
    expect(pushMock).toHaveBeenCalledWith('/auth/login');
  });
});
