import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { QUERY_USER } from '@/components/user';
import { renderWithProviders } from '@/test/test-utils';
import { UserEditForm } from './user-edit-form';

const MUTATION_EDIT_USER = graphql(`
  mutation editUser($input: EditUserInput!) {
    editUser(input: $input) {
      user {
        id
        bio
      }
    }
  }
`);

const currentUser = { id: '1', email: 'a@b.com', username: 'alice' };

const currentUserMock = {
  request: { query: QUERY_CURRENT_USER },
  result: { data: { currentUser } },
};

function userQueryMock(bio: string) {
  return {
    request: { query: QUERY_USER, variables: { filter: { id: { eq: '1' } } } },
    result: {
      data: {
        // __typename is required: Apollo's cache needs it to confirm the
        // entity satisfies the spread fragment's type condition.
        user: { __typename: 'User', id: '1', bio, username: 'alice', followersCount: 0, currentUserFollowershipAsFollower: null },
      },
    },
  };
}

describe('UserEditForm', () => {
  it('rejects mismatched password confirmation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserEditForm />, { mocks: [currentUserMock, userQueryMock('old bio')] });

    await screen.findByDisplayValue('old bio');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm password'), 'different123');
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));

    expect(await screen.findByText('Passwords must match')).toBeInTheDocument();
  });

  it('submits an edit and shows a success message', async () => {
    const user = userEvent.setup();
    const mocks = [
      currentUserMock,
      userQueryMock('old bio'),
      {
        request: { query: MUTATION_EDIT_USER, variables: { input: { data: { bio: 'new bio' } } } },
        result: { data: { editUser: { user: { id: '1', bio: 'new bio' } } } },
      },
    ];

    renderWithProviders(<UserEditForm />, { mocks });

    const bio = await screen.findByDisplayValue('old bio');
    await user.clear(bio);
    await user.type(bio, 'new bio');
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));

    expect(await screen.findByText('Successfully updated!')).toBeInTheDocument();
  });
});
