import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { ForestNew } from './forest-new';

const pushMock = vi.fn();
vi.mock('next/router', () => ({
  useRouter: () => ({ push: pushMock, query: {}, asPath: '/', pathname: '/' }),
}));

const MUTATION_FOREST_CREATE = graphql(`
  mutation createForest($input: CreateForestInput!) {
    createForest(input: $input) {
      forest {
        id
        name
      }
    }
  }
`);

const loggedInCurrentUser = {
  request: { query: QUERY_CURRENT_USER },
  result: { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } },
};

describe('ForestNew', () => {
  it('prompts to log in when there is no current user', async () => {
    const loggedOut = { request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: null } } };
    renderWithProviders(<ForestNew />, { mocks: [loggedOut] });

    expect(await screen.findByText(/not logged in/i)).toBeInTheDocument();
  });

  it('validates the forest name pattern', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForestNew />, { mocks: [loggedInCurrentUser] });

    await screen.findByLabelText('Name');
    await user.type(screen.getByLabelText('Name'), 'invalid name!');
    await user.type(screen.getByLabelText('About'), 'about text');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Only letters, numbers, dots, hyphens and underscores')).toBeInTheDocument();
    expect(screen.queryByText(/It cannot be edited/)).not.toBeInTheDocument();
  });

  it('creates a forest and navigates to it', async () => {
    const user = userEvent.setup();
    const mocks = [
      loggedInCurrentUser,
      {
        request: { query: MUTATION_FOREST_CREATE, variables: { input: { data: { name: 'redwood', about: 'about text' } } } },
        result: { data: { createForest: { forest: { id: 'f1', name: 'redwood' } } } },
      },
    ];

    renderWithProviders(<ForestNew />, { mocks });

    await screen.findByLabelText('Name');
    await user.type(screen.getByLabelText('Name'), 'redwood');
    await user.type(screen.getByLabelText('About'), 'about text');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await vi.waitFor(() => expect(pushMock).toHaveBeenCalledWith('/forest/redwood'));
  });
});
