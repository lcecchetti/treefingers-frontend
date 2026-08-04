import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { StoryTree } from './story-tree';

class MockResizeObserver {
  private callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe() {
    this.callback(
      [{ contentRect: { width: 300, height: 300 } } as ResizeObserverEntry],
      this as unknown as ResizeObserver
    );
  }
  unobserve() {}
  disconnect() {}
}

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('reduce') ? reducedMotion : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
  mockMatchMedia(false);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    closePath: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    rect: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const story = {
  id: 'story-1',
  descendentsCount: 4,
  childrenCount: 2,
  depth: 1,
  likesCount: 10,
  commentsCount: 3,
};

describe('StoryTree', () => {
  it('renders nothing when no story is given', () => {
    const { container } = render(<StoryTree />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a canvas when a story is given', () => {
    const { container } = render(<StoryTree story={story} />);
    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('marks the canvas as decorative', () => {
    const { container } = render(<StoryTree story={story} />);
    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not throw when re-rendered with a different story id', () => {
    const { rerender } = render(<StoryTree story={story} />);
    expect(() => rerender(<StoryTree story={{ ...story, id: 'story-2' }} />)).not.toThrow();
  });

  it('renders using the root story when the given story has one', () => {
    const withRoot = { ...story, id: 'chapter-1', root: story };
    expect(() => render(<StoryTree story={withRoot} />)).not.toThrow();
  });

  it('animates when the user has no motion preference', () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    render(<StoryTree story={story} />);
    expect(rafSpy).toHaveBeenCalled();
  });

  it('renders a single static frame when prefers-reduced-motion is set', () => {
    mockMatchMedia(true);
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    render(<StoryTree story={story} />);
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it('cancels the pending animation frame on unmount', () => {
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(<StoryTree story={story} />);
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('does not throw when the canvas context is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null as unknown as CanvasRenderingContext2D);
    expect(() => render(<StoryTree story={story} />)).not.toThrow();
  });
});
