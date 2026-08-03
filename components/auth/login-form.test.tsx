import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { Toasts } from '@/components/common';
import { LoginForm } from './login-form';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams(),
}));

const MUTATION_LOGIN = graphql(`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      currentUser {
        id
        username
      }
    }
  }
`);

const loggedOutCurrentUser = {
  request: { query: QUERY_CURRENT_USER },
  result: { data: { currentUser: null } },
};

describe('LoginForm', () => {
  it('shows required-field validation messages when submitted empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />, { mocks: [loggedOutCurrentUser] });

    // The email field is autofocused on mount; clicking into the password
    // field first blurs email (marking it touched) before the submit click
    // blurs password, so both fields' errors are touched and rendered.
    await user.click(screen.getByLabelText('Password'));
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findAllByText('Required')).toHaveLength(2);
  });

  it('logs in and redirects home on success', async () => {
    const user = userEvent.setup();
    const mocks = [
      loggedOutCurrentUser,
      {
        request: { query: MUTATION_LOGIN, variables: { input: { email: 'a@b.com', password: 'password123' } } },
        result: { data: { login: { currentUser: { id: '1', username: 'alice' } } } },
      },
      // onCompleted calls client.resetStore(), which refetches the active
      // currentUser query, so a second response for it is needed.
      loggedOutCurrentUser,
    ];

    renderWithProviders(
      <>
        <LoginForm />
        <Toasts />
      </>,
      { mocks }
    );

    await user.type(screen.getByLabelText('Email'), 'a@b.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await screen.findByText(/welcome!/);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('shows a resend-activation prompt when the account is not active yet', async () => {
    const user = userEvent.setup();
    const mocks = [
      loggedOutCurrentUser,
      {
        request: { query: MUTATION_LOGIN, variables: { input: { email: 'a@b.com', password: 'password123' } } },
        result: {
          errors: [{ message: 'Your account is not active yet, check your emails.' } as unknown as Error],
        },
      },
    ];

    renderWithProviders(<LoginForm />, { mocks });

    await user.type(screen.getByLabelText('Email'), 'a@b.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText(/Lost your activation email/)).toBeInTheDocument();
  });
});
