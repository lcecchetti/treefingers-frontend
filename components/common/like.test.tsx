import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { Toasts } from '@/components/common';
import { Like } from './like';

// The generated `graphql()` matches queries by exact source string against the
// codegen'd document map, so these must be copied verbatim (whitespace and
// all) from components/common/like.tsx rather than reformatted.
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
    let called = false;
    const mocks = [
      loggedIn,
      {
        request: { query: MUTATION_LIKE, variables: { input: { story: 's1' } } },
        result: () => { called = true; return { data: { like: { like: { id: 'l1', story: liked, comment: null } } } }; },
      },
    ];

    renderWithProviders(<Like entity={notLiked} />, { mocks });

    await clickHeartIcon(4);

    await vi.waitFor(() => expect(called).toBe(true));
  });

  it('sends the dislike mutation when already liked', async () => {
    let called = false;
    const mocks = [
      loggedIn,
      {
        request: { query: MUTATION_DISLIKE, variables: { input: { story: 's1' } } },
        result: () => { called = true; return { data: { dislike: { like: { id: 'l1', story: notLiked, comment: null } } } }; },
      },
    ];

    renderWithProviders(<Like entity={liked} />, { mocks });

    await clickHeartIcon(5);

    await vi.waitFor(() => expect(called).toBe(true));
  });

  it('does not respond to clicks when viewOnly', async () => {
    // An unmocked request doesn't throw or log - MockLink resolves it as a
    // GraphQL error delivered to the mutation's onError, which like.tsx
    // swallows silently. So a real mock + called flag is required here;
    // otherwise this test would pass identically whether or not viewOnly
    // actually blocks the click.
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
