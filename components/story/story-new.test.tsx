import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { graphql } from '@/lib/graphql/generated';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { renderWithProviders } from '@/test/test-utils';
import { StoryNew } from './story-new';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const QUERY_CHOOSE_FOREST = graphql(`
  query chooseForest($filter: FilterForestInput) {
    forests(filter: $filter, first: 10, sort: { membersCount: DESC }) {
      edges {
        node {
          id
          name
          storiesCount
        }
      }
    }
  }
`);

const loggedInCurrentUser = {
  request: { query: QUERY_CURRENT_USER },
  result: { data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } },
};

const chooseForestMock = {
  request: { query: QUERY_CHOOSE_FOREST, variables: { filter: {} } },
  result: { data: { forests: { edges: [{ node: { id: 'f1', name: 'redwood', storiesCount: 3 } }] } } },
};

describe('StoryNew (new root story)', () => {
  it('adds tags on click, removes a tag on click, and caps additions at 5 tags', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StoryNew />, { mocks: [loggedInCurrentUser, chooseForestMock] });

    const addTag = await screen.findByLabelText('Tag your story');
    const addTagButton = () => screen.getByRole('button', { name: 'Add Tag' });

    // Add Tag is disabled below 2 characters (addTag.length < 2), so tags are 2 chars each
    for (const tag of ['aa', 'bb', 'cc', 'dd', 'ee']) {
      await user.type(addTag, tag);
      expect(addTagButton()).not.toBeDisabled();
      await user.click(addTagButton());
    }

    // tag chips render as a <button> whose accessible name is the trimmed tag text;
    // getByText with exact:false is avoided since it substring-matches unrelated
    // text elsewhere on the page (e.g. "dd" matches inside "Add Tag")
    for (const tag of ['aa', 'bb', 'cc', 'dd', 'ee']) {
      expect(screen.getByRole('button', { name: tag })).toBeInTheDocument();
    }

    // remove the 'bb' tag by clicking its FaTimes icon
    const bbTagButton = screen.getByRole('button', { name: 'bb' });
    const removeIcon = bbTagButton.querySelector('svg');
    expect(removeIcon).not.toBeNull();
    await user.click(removeIcon!);

    expect(screen.queryByRole('button', { name: 'bb' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'aa' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cc' })).toBeInTheDocument();

    // re-add a tag to get back to 5 (aa, cc, dd, ee, ff), then confirm the cap blocks a 6th
    await user.type(addTag, 'ff');
    await user.click(addTagButton());
    expect(screen.getByRole('button', { name: 'ff' })).toBeInTheDocument();

    await user.type(addTag, 'gg');
    expect(addTagButton()).toBeDisabled();
  });

  it('populates the forest select from the chooseForest query', async () => {
    renderWithProviders(<StoryNew />, { mocks: [loggedInCurrentUser, chooseForestMock] });

    await screen.findByText(/redwood \(3 stories\)/);
  });
});
