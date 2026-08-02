import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { InfiniteScroll } from './infinite-scroll';

let observedCallback: IntersectionObserverCallback;
let lastObserverOptions: IntersectionObserverInit | undefined;
const observe = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
  observe.mockClear();
  disconnect.mockClear();
  vi.stubGlobal('IntersectionObserver', vi.fn().mockImplementation(function (cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    observedCallback = cb;
    lastObserverOptions = options;
    return { observe, disconnect, unobserve: vi.fn() };
  }));
  // jsdom doesn't implement Element.scrollTo; the backwards-scroll effect calls it on mount.
  Element.prototype.scrollTo = vi.fn();
});

function fireIntersecting() {
  observedCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
}

describe('InfiniteScroll', () => {
  it('observes the sentinel with a full threshold', () => {
    render(<InfiniteScroll onLoadMore={vi.fn()} loading={false} hasMore>content</InfiniteScroll>);

    expect(observe).toHaveBeenCalledTimes(1);
    expect(lastObserverOptions).toMatchObject({ threshold: 1 });
  });

  it('calls onLoadMore when the sentinel intersects and hasMore/loading allow it', () => {
    const onLoadMore = vi.fn();
    render(<InfiniteScroll onLoadMore={onLoadMore} loading={false} hasMore>content</InfiniteScroll>);

    fireIntersecting();

    expect(onLoadMore).toHaveBeenCalledWith({ notifyOnNetworkStatusChange: true });
  });

  it('does not call onLoadMore when hasMore is false', () => {
    const onLoadMore = vi.fn();
    render(<InfiniteScroll onLoadMore={onLoadMore} loading={false} hasMore={false}>content</InfiniteScroll>);

    fireIntersecting();

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('does not observe the sentinel at all when hasMore is false', () => {
    render(<InfiniteScroll onLoadMore={vi.fn()} loading={false} hasMore={false}>content</InfiniteScroll>);
    expect(observe).not.toHaveBeenCalled();
  });

  it('renders the sentinel/spinner before content when backwards, after content otherwise', () => {
    const { container: forwards } = render(<InfiniteScroll onLoadMore={vi.fn()} loading={false} hasMore>middle</InfiniteScroll>);
    const forwardsChildren = Array.from(forwards.querySelector('div')!.children).map((el) => el.textContent);
    expect(forwardsChildren[forwardsChildren.length - 1]).not.toBe('middle');

    const { container: backwards } = render(
      <InfiniteScroll onLoadMore={vi.fn()} loading={false} hasMore backwards>middle</InfiniteScroll>
    );
    const backwardsChildren = Array.from(backwards.querySelector('div')!.children).map((el) => el.textContent);
    expect(backwardsChildren[0]).not.toBe('middle');
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<InfiniteScroll onLoadMore={vi.fn()} loading={false} hasMore>content</InfiniteScroll>);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
