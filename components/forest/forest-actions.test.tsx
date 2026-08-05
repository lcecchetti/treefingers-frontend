import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { Flyout } from '@/components/common';
import { ForestActions } from './forest-actions';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Must match components/comment/comment-list.tsx verbatim: graphql() matches
// by exact source string against the codegen'd document map.
const QUERY_COMMENTS = graphql(`
  query comments($filter: FilterCommentInput, $sort: SortCommentInput, $last: Int, $before: String) {
    comments(filter: $filter, sort: $sort, last: $last, before: $before) {
      edges {
        cursor
        node {
          __typename
          id
          content
          createdAt
          likesCount
          currentUserLike {
            id
          }
          user {
            id
            username
          }
          story {
            id
            commentsCount
          }
          forest {
            id
            commentsCount
          }
        }
      }
      pageInfo {
        startCursor
        hasPreviousPage
      }
    }
  }
`);

const loggedOut = { request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: null } } };
const forest = { __typename: 'Forest' as const, id: 'f1', membersCount: 5, currentUserMembership: null, commentsCount: 2 };

const emptyComments = {
  request: { query: QUERY_COMMENTS, variables: { filter: { forest: { eq: 'f1' } }, sort: { id: 'ASC' }, last: 10 } },
  result: { data: { comments: { edges: [], pageInfo: { startCursor: null, hasPreviousPage: false } } } },
};

beforeEach(() => {
  // CommentList wraps its content in InfiniteScroll, which needs both in jsdom.
  vi.stubGlobal('IntersectionObserver', vi.fn().mockImplementation(function () {
    return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
  }));
  Element.prototype.scrollTo = vi.fn();
});

describe('ForestActions', () => {
  it('shows the comment count', async () => {
    renderWithProviders(<ForestActions forest={forest} />, { mocks: [loggedOut] });
    expect(await screen.findByText('2')).toBeInTheDocument();
  });

  it('opens the comments flyout for this forest when the comment icon is clicked', async () => {
    renderWithProviders(<><ForestActions forest={forest} /><Flyout /></>, { mocks: [loggedOut, emptyComments] });

    const commentIcon = (await screen.findByText('2')).parentElement!.querySelector('svg')!;
    // Click mounts CommentList, which suspends on useSuspenseQuery; the mount and
    // MockLink resolution must happen inside one awaited act for the retry to commit.
    await act(async () => {
      fireEvent.click(commentIcon);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Heading level (h3), not plain text: SheetContent also renders a
    // visually-hidden h2 SheetTitle for Radix a11y.
    expect(await screen.findByRole('heading', { level: 3, name: 'Comments' })).toBeInTheDocument();
    expect(await screen.findByText('This forest has no comments yet.')).toBeInTheDocument();
  });
});
