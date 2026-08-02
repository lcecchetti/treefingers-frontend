import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { renderWithProviders } from '@/test/test-utils';
import { Toasts } from '@/components/common';
import { ForgotPasswordForm } from './forgot-password-form';

vi.mock('next/router', () => ({
  useRouter: () => ({ query: {}, asPath: '/', pathname: '/' }),
}));

const MUTATION_FORGOT_PASSWORD = graphql(`
  mutation forgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      result
    }
  }
`);

describe('ForgotPasswordForm', () => {
  it('requires an email before submitting', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordForm />);

    await user.click(screen.getByRole('button', { name: 'Send email' }));

    expect(await screen.findByText('Required')).toBeInTheDocument();
  });

  it('shows a confirmation toast on success', async () => {
    const user = userEvent.setup();
    const mocks = [{
      request: { query: MUTATION_FORGOT_PASSWORD, variables: { input: { email: 'a@b.com' } } },
      result: { data: { forgotPassword: { result: true } } },
    }];

    renderWithProviders(
      <>
        <ForgotPasswordForm />
        <Toasts />
      </>,
      { mocks }
    );

    await user.type(screen.getByLabelText('Email'), 'a@b.com');
    await user.click(screen.getByRole('button', { name: 'Send email' }));

    expect(await screen.findByText(/we've sent a reset link/i)).toBeInTheDocument();
  });
});
