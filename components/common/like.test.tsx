import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { Toasts } from '@/components/common';
import { Like } from './like';

// Must match components/common/like.tsx verbatim: graphql() matches by exact
// source string against the codegen'd document map.
const MUTATION_LIKE = graphql(`
  mutation like($input: LikeInput!) {
    like(input: $input) {
      like {
        id
        story {
          id
          likesCount
          currentUserLike {
            id
          }
        }
        comment {
          id
          likesCount
          currentUserLike {
            id
          }
        }
      }
    }
  }
`);

const MUTATION_DISLIKE = graphql(`
  mutation dislike($input: DislikeInput!) {
    dislike(input: $input) {
      like {
        id
        story {
          id
          likesCount
          currentUserLike {
            id
          }
        }
        comment {
          id
          likesCount
          currentUserLike {
            id
          }
        }
      }
    }
  }
`);

const loggedIn = { request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } } };
const loggedOut = { request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: null } } };

const notLiked = { __typename: 'Story' as const, id: 's1', likesCount: 4, currentUserLike: null };
const liked = { __typename: 'Story' as const, id: 's1', likesCount: 5, currentUserLike: { id: 'l1' } };

// Toasts renders its own icon (close button), so scope the click to Like's own
// container rather than querying the document for any <svg>.
async function clickHeartIcon(likesCount: number) {
  const label = await screen.findByText(String(likesCount));
  const icon = label.closest('div')!.querySelector('svg')!;
  const user = userEvent.setup();
  await user.click(icon);
  return user;
}

describe('Like', () => {
  it('shows a login prompt toast when clicked while logged out', async () => {
    renderWithProviders(<><Like entity={notLiked} /><Toasts /></>, { mocks: [loggedOut] });

    await clickHeartIcon(4);

    expect(await screen.findByText('You need to be logged in.')).toBeInTheDocument();
  });

  it('sends the like mutation when not yet liked', async () => {
    let authLoaded = false;
    let called = false;
    const mocks = [
      { request: { query: QUERY_CURRENT_USER }, result: () => { authLoaded = true; return { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } }; } },
      {
        request: { query: MUTATION_LIKE, variables: { input: { story: 's1' } } },
        result: () => { called = true; return { data: { like: { like: { id: 'l1', story: liked, comment: null } } } }; },
      },
    ];

    renderWithProviders(<Like entity={notLiked} />, { mocks });

    // The click only fires the mutation once useCurrentUser has resolved a
    // logged-in user; wait for the auth query to be delivered before clicking.
    await vi.waitFor(() => expect(authLoaded).toBe(true));
    await clickHeartIcon(4);

    await vi.waitFor(() => expect(called).toBe(true));
  });

  it('sends the dislike mutation when already liked', async () => {
    let authLoaded = false;
    let called = false;
    const mocks = [
      { request: { query: QUERY_CURRENT_USER }, result: () => { authLoaded = true; return { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } }; } },
      {
        request: { query: MUTATION_DISLIKE, variables: { input: { story: 's1' } } },
        result: () => { called = true; return { data: { dislike: { like: { id: 'l1', story: notLiked, comment: null } } } }; },
      },
    ];

    renderWithProviders(<Like entity={liked} />, { mocks });

    await vi.waitFor(() => expect(authLoaded).toBe(true));
    await clickHeartIcon(5);

    await vi.waitFor(() => expect(called).toBe(true));
  });

  it('does not respond to clicks when viewOnly', async () => {
    // like.tsx swallows unmocked-mutation errors silently, so a real mock +
    // called flag is required here to actually assert viewOnly blocks the click.
    let called = false;
    const mocks = [
      loggedIn,
      {
        request: { query: MUTATION_LIKE, variables: { input: { story: 's1' } } },
        result: () => { called = true; return { data: { like: { like: { id: 'l1', story: liked, comment: null } } } }; },
      },
    ];

    renderWithProviders(<Like entity={notLiked} viewOnly />, { mocks });

    await clickHeartIcon(4);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(called).toBe(false);
  });
});
