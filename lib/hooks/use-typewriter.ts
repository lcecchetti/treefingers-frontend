import { useEffect, useState } from 'react';

export interface TypewriterSegment {
  text: string;
  backspace?: boolean;
}

export interface UseTypewriterOptions {
  typingDelayMs?: number;
  startDelayMs?: number;
  pauseBeforeBackspaceMs?: number;
}

// Types each segment's text one character at a time, optionally pauses and
// backspaces it to empty, then moves to the next segment.
export function useTypewriter(
  segments: TypewriterSegment[],
  options: UseTypewriterOptions = {}
): string {
  const { typingDelayMs = 50, startDelayMs = 0, pauseBeforeBackspaceMs = 500 } = options;
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const runSegment = (index: number) => {
      if (cancelled || index >= segments.length) return;
      const { text, backspace } = segments[index];
      let position = 0;

      const typeChar = () => {
        if (cancelled) return;
        position += 1;
        setDisplayed(text.slice(0, position));
        if (position < text.length) {
          timeoutId = setTimeout(typeChar, typingDelayMs);
          return;
        }
        if (!backspace) {
          runSegment(index + 1);
          return;
        }
        timeoutId = setTimeout(eraseChar, pauseBeforeBackspaceMs);
      };

      const eraseChar = () => {
        if (cancelled) return;
        position -= 1;
        setDisplayed(text.slice(0, position));
        if (position > 0) {
          timeoutId = setTimeout(eraseChar, typingDelayMs);
          return;
        }
        runSegment(index + 1);
      };

      typeChar();
    };

    timeoutId = setTimeout(() => runSegment(0), startDelayMs);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [segments, typingDelayMs, startDelayMs, pauseBeforeBackspaceMs]);

  return displayed;
}
