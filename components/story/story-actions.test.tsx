import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { StoryActions, type StoryActionsStory } from './story-actions';

const loggedOut = { request: { query: QUERY_CURRENT_USER }, result: { data: { currentUser: null } } };

const story: StoryActionsStory = {
  id: 's1',
  title: 'A Tale',
  descendentsCount: 2,
  likesCount: 3,
  commentsCount: 4,
  currentUserLike: null,
  __typename: 'Story',
};

describe('StoryActions', () => {
  it('renders tree, comment, and like actions by default', async () => {
    const { container } = renderWithProviders(<StoryActions story={story} />, { mocks: [loggedOut] });
    await screen.findByText('4'); // commentsCount

    expect(container.querySelectorAll('svg').length).toBe(3); // tree, comment, like icons
    expect(screen.getByText('3')).toBeInTheDocument(); // likesCount
    expect(screen.getByText('4')).toBeInTheDocument(); // commentsCount
  });

  it('hides the like action when disabled via disabledActions', async () => {
    const { container } = renderWithProviders(<StoryActions story={story} disabledActions={{ like: true }} />, { mocks: [loggedOut] });
    await screen.findByText('4'); // commentsCount still present

    expect(container.querySelectorAll('svg').length).toBe(2); // tree and comment icons only
    expect(screen.queryByText('3')).not.toBeInTheDocument(); // likesCount gone with Like unmounted
  });
});
