import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { StoryTree } from './story-tree';

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    closePath: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
});

const story = { id: 'story-1', descendentsCount: 4, likesCount: 10 };

describe('StoryTree', () => {
  it('renders nothing when no story is given', () => {
    const { container } = render(<StoryTree />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a canvas when a story is given', () => {
    const { container } = render(<StoryTree story={story} />);
    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('does not throw when re-rendered with a different story id', () => {
    const { rerender } = render(<StoryTree story={story} />);
    expect(() => rerender(<StoryTree story={{ ...story, id: 'story-2' }} />)).not.toThrow();
  });

  it('renders using the root story when the given story has one', () => {
    const withRoot = { ...story, id: 'chapter-1', root: story };
    expect(() => render(<StoryTree story={withRoot} />)).not.toThrow();
  });
});
