import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { StoryTreeOverlay } from './story-tree-overlay';
import { QUERY_STORY_TREE_SHAPE } from './story-tree-overlay.query';

// mirrors StoryTree's own story?.root ?? story resolution, since the real
// component is mocked out here and this test cares about what StoryTreeOverlay
// passes down, not the canvas rendering itself
vi.mock('./story-tree', () => ({
  StoryTree: vi.fn(({ story }: { story?: { id: string; root?: { id: string } } }) => (
    <div data-testid="story-tree">{story?.root?.id ?? story?.id ?? 'none'}</div>
  )),
}));

const mockUsePathname = vi.fn<() => string>();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

function mockFor(chapterId: string, rootId: string): MockedResponse {
  return {
    request: { query: QUERY_STORY_TREE_SHAPE, variables: { filter: { id: { eq: chapterId } } } },
    result: {
      data: {
        story: {
          __typename: 'Story' as const,
          id: chapterId,
          descendantsCount: 1,
          childrenCount: 1,
          depth: 0,
          likesCount: 0,
          commentsCount: 0,
          root: {
            __typename: 'Story' as const,
            id: rootId,
            descendantsCount: 1,
            childrenCount: 1,
            depth: 0,
            likesCount: 0,
            commentsCount: 0,
          },
        },
      },
    },
  };
}

describe('StoryTreeOverlay', () => {
  it('renders nothing when not on a story page', () => {
    mockUsePathname.mockReturnValue('/stories');
    const { container } = render(
      <MockedProvider mocks={[]}>
        <StoryTreeOverlay />
      </MockedProvider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing on the "new story" page, which also lives under /story/', () => {
    mockUsePathname.mockReturnValue('/story/new');
    const { container } = render(
      <MockedProvider mocks={[]}>
        <StoryTreeOverlay />
      </MockedProvider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the tree from its own fetched story data, keyed off the URL', async () => {
    mockUsePathname.mockReturnValue('/story/chapter-1');
    const mocks = [mockFor('chapter-1', 'root-1')];
    render(
      <MockedProvider mocks={mocks}>
        <StoryTreeOverlay />
      </MockedProvider>
    );

    await screen.findByText('root-1', { selector: '[data-testid="story-tree"]' });
  });

  it('keeps showing the previous chapter\'s tree while the next chapter (same root) is still loading', async () => {
    mockUsePathname.mockReturnValue('/story/chapter-1');
    const mocks = [mockFor('chapter-1', 'root-1'), mockFor('chapter-2', 'root-1')];
    const { rerender } = render(
      <MockedProvider mocks={mocks}>
        <StoryTreeOverlay />
      </MockedProvider>
    );
    await screen.findByText('root-1', { selector: '[data-testid="story-tree"]' });

    // simulates a chapter switch: chapter-2's query hasn't resolved yet
    mockUsePathname.mockReturnValue('/story/chapter-2');
    rerender(
      <MockedProvider mocks={mocks}>
        <StoryTreeOverlay />
      </MockedProvider>
    );

    // still showing root-1 immediately, never drops to "none" mid-fetch
    expect(screen.getByTestId('story-tree')).toHaveTextContent('root-1');
  });

  it('eventually shows a genuinely different tree when switching to a different story', async () => {
    mockUsePathname.mockReturnValue('/story/chapter-1');
    const mocks = [mockFor('chapter-1', 'root-1'), mockFor('chapter-2', 'root-2')];
    const { rerender } = render(
      <MockedProvider mocks={mocks}>
        <StoryTreeOverlay />
      </MockedProvider>
    );
    await screen.findByText('root-1', { selector: '[data-testid="story-tree"]' });

    mockUsePathname.mockReturnValue('/story/chapter-2');
    rerender(
      <MockedProvider mocks={mocks}>
        <StoryTreeOverlay />
      </MockedProvider>
    );

    await screen.findByText('root-2', { selector: '[data-testid="story-tree"]' });
  });
});
