import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { renderWithProviders } from '@/test/test-utils';
import { Toasts } from '@/components/common';
import { ChangePasswordForm } from './change-password-form';

const pushMock = vi.fn();
vi.mock('next/router', () => ({
  useRouter: () => ({ push: pushMock, query: {}, asPath: '/', pathname: '/' }),
}));

const MUTATION_CHANGE_PASSWORD = graphql(`
  mutation changePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      result
    }
  }
`);

describe('ChangePasswordForm', () => {
  it('rejects mismatched password confirmation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePasswordForm token="tok" />);

    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'different123');
    await user.click(screen.getByRole('button', { name: 'Update password' }));

    expect(await screen.findByText('Passwords must match')).toBeInTheDocument();
  });

  it('changes the password and redirects to login on success', async () => {
    const user = userEvent.setup();
    const mocks = [{
      request: { query: MUTATION_CHANGE_PASSWORD, variables: { input: { password: 'password123', token: 'tok' } } },
      result: { data: { changePassword: { result: true } } },
    }];

    renderWithProviders(
      <>
        <ChangePasswordForm token="tok" />
        <Toasts />
      </>,
      { mocks }
    );

    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Update password' }));

    expect(await screen.findByText('Your password has been changed')).toBeInTheDocument();
    expect(pushMock).toHaveBeenCalledWith('/auth/login');
  });
});
