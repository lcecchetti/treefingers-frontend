import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTypewriter } from './use-typewriter';

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('types a single segment one character at a time', () => {
    const segments = [{ text: 'hi' }];
    const { result } = renderHook(() => useTypewriter(segments, { typingDelayMs: 10, startDelayMs: 0 }));

    expect(result.current).toBe('');

    act(() => { vi.advanceTimersByTime(0); });
    expect(result.current).toBe('h');

    act(() => { vi.advanceTimersByTime(10); });
    expect(result.current).toBe('hi');
  });

  it('waits startDelayMs before typing the first character', () => {
    const segments = [{ text: 'x' }];
    const { result } = renderHook(() => useTypewriter(segments, { startDelayMs: 100, typingDelayMs: 10 }));

    act(() => { vi.advanceTimersByTime(50); });
    expect(result.current).toBe('');

    act(() => { vi.advanceTimersByTime(50); });
    expect(result.current).toBe('x');
  });

  it('backspaces a segment to empty before moving to the next one', () => {
    const segments = [{ text: 'ab', backspace: true }, { text: 'c' }];
    const { result } = renderHook(() =>
      useTypewriter(segments, { typingDelayMs: 10, pauseBeforeBackspaceMs: 20, startDelayMs: 0 })
    );

    act(() => { vi.advanceTimersByTime(0); }); // startDelay timer -> types 'a'
    expect(result.current).toBe('a');

    act(() => { vi.advanceTimersByTime(10); }); // types 'b'
    expect(result.current).toBe('ab');

    act(() => { vi.advanceTimersByTime(20); }); // pauseBeforeBackspaceMs elapses, first erase tick
    expect(result.current).toBe('a');

    act(() => { vi.advanceTimersByTime(10); }); // erase to empty, then synchronously start + finish typing 'c'
    expect(result.current).toBe('c');
  });

  it('stops updating after unmount', () => {
    const segments = [{ text: 'hi' }];
    const { result, unmount } = renderHook(() => useTypewriter(segments, { typingDelayMs: 10 }));

    unmount();

    expect(() => act(() => { vi.advanceTimersByTime(1000); })).not.toThrow();
    expect(result.current).toBe('');
  });
});
