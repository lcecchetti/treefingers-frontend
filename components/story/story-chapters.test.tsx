import { describe, it, expect } from 'vitest';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { makeFragmentData } from '@/lib/graphql/generated';
import { StoryChaptersView } from './story-chapters';
import { StoryCard_StoryFragment } from './story-card';

const loggedOut = { request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: null } } };

const chapter = makeFragmentData({
  __typename: 'Story' as const,
  id: 'chapter-1',
  title: 'Chapter One',
  excerpt: 'excerpt',
  createdAt: '2024-01-01T00:00:00.000Z',
  depth: 1,
  parent: { id: 'root-1', likesCount: 0, descendantsCount: 1 },
  author: { id: 'author-1', username: 'writer' },
  tags: [],
  likesCount: 0,
  commentsCount: 0,
  descendantsCount: 0,
  childrenCount: 0,
  currentUserLike: null,
}, StoryCard_StoryFragment);

describe('StoryChaptersView', () => {
  // Regression coverage for the fallback rendering chapters as a plain
  // stacked list instead of this carousel.
  it('renders chapters inside the swiper carousel', () => {
    const { container } = renderWithProviders(
      <StoryChaptersView parentId="root-1" edges={[{ cursor: 'c1', node: { id: 'chapter-1', ...chapter } }]} />,
      { mocks: [loggedOut] }
    );

    expect(container.querySelector('.swiper-button-next')).toBeInTheDocument();
    expect(container.querySelector('.swiper-button-prev')).toBeInTheDocument();
  });
});
