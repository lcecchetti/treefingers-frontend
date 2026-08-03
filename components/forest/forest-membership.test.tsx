import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { Toasts } from '@/components/common';
import { ForestMembership } from './forest-membership';

// The generated `graphql()` matches queries by exact source string against the
// codegen'd document map, so these must be copied verbatim (whitespace and
// all) from components/forest/forest-membership.tsx rather than reformatted.
const MUTATION_JOIN = graphql(`
  mutation join($input: JoinInput!) {
    join(input: $input) {
      membership {
        id
        forest {
          id
          membersCount
          currentUserMembership {
            id
          }
        }
      }
    }
  }
`);

const MUTATION_LEAVE = graphql(`
  mutation leave($input: LeaveInput!) {
    leave(input: $input) {
      membership {
        id
        forest {
          id
          membersCount
          currentUserMembership {
            id
          }
        }
      }
    }
  }
`);

const loggedIn = { request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } } };
const loggedOut = { request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: null } } };

const notJoined = { id: 'f1', membersCount: 10, currentUserMembership: null };
const joined = { id: 'f1', membersCount: 11, currentUserMembership: { id: 'm1' } };

async function clickMembershipIcon(membersCount: number) {
  const label = await screen.findByText(String(membersCount));
  const icon = label.closest('div')!.querySelector('svg')!;
  const user = userEvent.setup();
  await user.click(icon);
  return user;
}

describe('ForestMembership', () => {
  it('shows a login prompt toast when clicked while logged out', async () => {
    renderWithProviders(<><ForestMembership forest={notJoined} /><Toasts /></>, { mocks: [loggedOut] });

    await clickMembershipIcon(10);

    expect(await screen.findByText('You need to be logged in to join.')).toBeInTheDocument();
  });

  it('sends the join mutation when not yet a member', async () => {
    let authLoaded = false;
    let called = false;
    const mocks = [
      { request: { query: QUERY_CURRENT_USER }, result: () => { authLoaded = true; return { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } }; } },
      {
        request: { query: MUTATION_JOIN, variables: { input: { forest: 'f1' } } },
        result: () => { called = true; return { data: { join: { membership: { id: 'm1', forest: joined } } } }; },
      },
    ];

    renderWithProviders(<ForestMembership forest={notJoined} />, { mocks });

    // The click only fires the mutation once useCurrentUser has resolved a
    // logged-in user; wait for the auth query to be delivered before clicking.
    await vi.waitFor(() => expect(authLoaded).toBe(true));
    await clickMembershipIcon(10);

    await vi.waitFor(() => expect(called).toBe(true));
  });

  it('sends the leave mutation when already a member', async () => {
    let authLoaded = false;
    let called = false;
    const mocks = [
      { request: { query: QUERY_CURRENT_USER }, result: () => { authLoaded = true; return { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } }; } },
      {
        request: { query: MUTATION_LEAVE, variables: { input: { forest: 'f1' } } },
        result: () => { called = true; return { data: { leave: { membership: { id: 'm1', forest: notJoined } } } }; },
      },
    ];

    renderWithProviders(<ForestMembership forest={joined} />, { mocks });

    await vi.waitFor(() => expect(authLoaded).toBe(true));
    await clickMembershipIcon(11);

    await vi.waitFor(() => expect(called).toBe(true));
  });
});
