import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StrictMode } from 'react';
import { render } from '@testing-library/react';
import { StoryTree, __resetGrowthCacheForTests } from './story-tree';
import { renderTree } from './story-tree.render';

vi.mock('./story-tree.render', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./story-tree.render')>();
  return { ...actual, renderTree: vi.fn(actual.renderTree) };
});

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

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }
  observe() {}
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
  __resetGrowthCacheForTests();
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
  MockIntersectionObserver.instances = [];
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
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
  descendantsCount: 4,
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

  it('pauses the animation when scrolled out of view, and resumes when visible again', () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
    render(<StoryTree story={story} />);
    expect(rafSpy).toHaveBeenCalled();

    const observer = MockIntersectionObserver.instances.at(-1)!;
    cancelSpy.mockClear();
    observer.callback([{ isIntersecting: false } as IntersectionObserverEntry], observer as unknown as IntersectionObserver);
    expect(cancelSpy).toHaveBeenCalled();

    rafSpy.mockClear();
    observer.callback([{ isIntersecting: true } as IntersectionObserverEntry], observer as unknown as IntersectionObserver);
    expect(rafSpy).toHaveBeenCalled();
  });

  it('grows the tree from bare ground on its first frame, reaching full growth once the duration elapses', () => {
    let rafCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      rafCallback = callback;
      return 1;
    });
    vi.mocked(renderTree).mockClear();

    render(<StoryTree story={story} />);
    expect(rafCallback).not.toBeNull();

    rafCallback!(0);
    const [, , , , , firstGrowth] = vi.mocked(renderTree).mock.calls[0];
    expect(firstGrowth).toBe(0);

    rafCallback!(5000); // well past the growth duration
    const lastCall = vi.mocked(renderTree).mock.calls.at(-1)!;
    expect(lastCall[5]).toBe(1);
  });

  it('does not regrow a tree it has already grown, e.g. when navigating between chapters remounts the component', () => {
    let rafCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      rafCallback = callback;
      return 1;
    });

    const { unmount } = render(<StoryTree story={story} />);
    rafCallback!(0);
    expect(vi.mocked(renderTree).mock.calls[0][5]).toBe(0); // grew from bare ground the first time
    rafCallback!(5000); // let it finish growing before the "chapter switch"
    unmount();

    vi.mocked(renderTree).mockClear();
    rafCallback = null;
    // a different chapter of the same story: different id, but the same root
    render(<StoryTree story={{ ...story, id: 'chapter-2', root: story }} />);
    rafCallback!(0);
    expect(vi.mocked(renderTree).mock.calls[0][5]).toBe(1); // same tree already grown, no replay
  });

  it('still grows on the first page view even under Strict Mode\'s dev-only double-invoke of effects', () => {
    let rafCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      rafCallback = callback;
      return 1;
    });
    vi.mocked(renderTree).mockClear();

    render(
      <StrictMode>
        <StoryTree story={story} />
      </StrictMode>
    );
    // Strict Mode already ran setup -> cleanup -> setup synchronously before
    // this; rafCallback now points at the surviving (second) effect run's loop
    rafCallback!(0);
    expect(vi.mocked(renderTree).mock.calls.at(-1)![5]).toBe(0); // still bare ground, not pre-marked grown
  });

  it('still grows a genuinely different tree normally', () => {
    let rafCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      rafCallback = callback;
      return 1;
    });

    const { unmount } = render(<StoryTree story={story} />);
    rafCallback!(0);
    unmount();

    vi.mocked(renderTree).mockClear();
    rafCallback = null;
    render(<StoryTree story={{ ...story, id: 'story-2' }} />);
    rafCallback!(0);
    expect(vi.mocked(renderTree).mock.calls[0][5]).toBe(0);
  });

  it('renders already fully grown when prefers-reduced-motion is set', () => {
    mockMatchMedia(true);
    vi.mocked(renderTree).mockClear();

    render(<StoryTree story={story} />);

    const call = vi.mocked(renderTree).mock.calls[0];
    expect(call[4]).toBeNull(); // static frame, no animation time
    expect(call[5]).toBe(1); // but fully grown, not bare
  });

  it('throttles draws to roughly 30fps instead of drawing on every animation frame', () => {
    let rafCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      rafCallback = callback;
      return 1;
    });
    vi.mocked(renderTree).mockClear();

    render(<StoryTree story={story} />);
    expect(rafCallback).not.toBeNull();

    // several frames land inside the same ~33ms throttle window
    rafCallback!(0);
    rafCallback!(10);
    rafCallback!(20);
    expect(renderTree).toHaveBeenCalledTimes(1);

    // this one lands past the throttle window
    rafCallback!(40);
    expect(renderTree).toHaveBeenCalledTimes(2);
  });
});
