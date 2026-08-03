import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProvidersAsync } from '@/test/test-utils';
import { CommentList, QUERY_COMMENTS, getCommentsFilter } from './comment-list';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  // CommentList wraps its content in InfiniteScroll(backwards), which needs both of these in jsdom.
  vi.stubGlobal('IntersectionObserver', vi.fn().mockImplementation(function () {
    return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
  }));
  Element.prototype.scrollTo = vi.fn();
});

const story = { __typename: 'Story' as const, id: 's1' };

describe('getCommentsFilter', () => {
  it('filters by story for a Story entity', () => {
    expect(getCommentsFilter(story)).toEqual({ story: { eq: 's1' } });
  });

  it('filters by forest for a Forest entity', () => {
    expect(getCommentsFilter({ __typename: 'Forest', id: 'f1' })).toEqual({ forest: { eq: 'f1' } });
  });
});

describe('CommentList', () => {
  it('shows an empty-state message when there are no comments', async () => {
    const mocks = [{
      request: { query: QUERY_COMMENTS, variables: { filter: getCommentsFilter(story), sort: { id: 'ASC' }, last: 10 } },
      result: { data: { comments: { edges: [], pageInfo: { startCursor: null, hasPreviousPage: false } } } },
    }];

    await renderWithProvidersAsync(<CommentList entity={story} />, { mocks });

    expect(await screen.findByText(/has no comments yet/)).toBeInTheDocument();
  });

  it('renders each comment with its author and content', async () => {
    const mocks = [{
      request: { query: QUERY_COMMENTS, variables: { filter: getCommentsFilter(story), sort: { id: 'ASC' }, last: 10 } },
      result: {
        data: {
          comments: {
            edges: [{
              cursor: 'c1',
              node: {
                __typename: 'Comment',
                id: 'c1',
                content: 'Great story!',
                createdAt: '2024-03-05T10:00:00.000Z',
                likesCount: 2,
                currentUserLike: null,
                user: { id: 'u1', username: 'bob' },
                story: { id: 's1', commentsCount: 1 },
                forest: null,
              },
            }],
            pageInfo: { startCursor: 'c1', hasPreviousPage: false },
          },
        },
      },
    }];

    await renderWithProvidersAsync(<CommentList entity={story} />, { mocks });

    expect(await screen.findByText('Great story!')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
  });
});
