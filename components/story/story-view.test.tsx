import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProvidersAsync } from '@/test/test-utils';
import { StoryView } from './story-view';
import { QUERY_STORY } from './story-view.query';

const loggedOutCurrentUser = {
  request: { query: QUERY_CURRENT_USER },
  result: { data: { currentUser: null } },
};

describe('StoryView', () => {
  // Reproduces prod crash digest 496186267: errorPolicy: 'all' resolves
  // `data` as undefined rather than throwing, so `data!.story` blows up.
  it('does not crash when the query errors with no data (errorPolicy: all)', async () => {
    const mocks = [
      loggedOutCurrentUser,
      {
        request: { query: QUERY_STORY, variables: { filter: { id: { eq: 'story-1' } } } },
        result: { errors: [{ message: 'boom' } as unknown as Error] },
      },
    ];

    await renderWithProvidersAsync(<StoryView storyId="story-1" />, { mocks });

    expect(await screen.findByText('boom')).toBeInTheDocument();
  });
});
