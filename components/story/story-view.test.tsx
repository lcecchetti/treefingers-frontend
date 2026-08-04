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
  // reproduces the prod crash (digest 496186267): errorPolicy: 'all' means
  // Apollo resolves `data` as undefined (not throwing) when the query errors
  // without partial data - code that reads `data!.story` instead of
  // `data?.story` blows up with "Cannot read properties of undefined
  // (reading 'story')" on the very first render of a real page
  it('does not crash when the query errors with no data (errorPolicy: all)', async () => {
    const mocks = [
      loggedOutCurrentUser,
      {
        request: { query: QUERY_STORY, variables: { filter: { id: { eq: 'story-1' } } } },
        result: { errors: [{ message: 'boom' } as unknown as Error] },
      },
    ];

    await renderWithProvidersAsync(<StoryView story={{ id: 'story-1' }} />, { mocks });

    expect(await screen.findByText('boom')).toBeInTheDocument();
  });
});
