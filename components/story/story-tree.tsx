'use client';

import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { buildTreeGeometry, type StoryTreeStory } from './story-tree.geometry';
import { renderTree } from './story-tree.render';

export type { StoryTreeStory };

interface StoryTreeProps {
  story?: StoryTreeStory;
  className?: string;
}

export const StoryTree = ({ story, className }: StoryTreeProps) => {
  const resolvedStory = story?.root ?? story;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const geometry = useMemo(
    () => (resolvedStory ? buildTreeGeometry(resolvedStory) : null),
    // keyed on id only, matching the previous implementation's contract: the
    // tree reflects a story's stats as of when it was resolved, not a live
    // subscription to every subsequent stat change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolvedStory?.id]
  );

  useEffect(() => {
    if (!geometry) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animate = !reducedMotionQuery.matches;
    // assume visible until the observer's first (async) callback says
    // otherwise, so a story that's actually on screen doesn't sit blank
    // waiting for that first report
    let visible = true;
    let width = 0;
    let height = 0;
    let frameId: number | null = null;
    // a "quiet wind" doesn't need 60 real draws a second to read as smooth
    // -- this halves how often the (potentially several-thousand-call) draw
    // actually runs, while requestAnimationFrame still gets scheduled every
    // frame so pausing on hidden tabs keeps working
    const FRAME_INTERVAL_MS = 33;
    let lastDrawTime = -Infinity;

    const draw = (time: number | null) => {
      if (width === 0 || height === 0) return;
      renderTree(ctx, geometry, width, height, time);
    };

    const loop = (time: number) => {
      if (time - lastDrawTime >= FRAME_INTERVAL_MS) {
        lastDrawTime = time;
        draw(time);
      }
      frameId = requestAnimationFrame(loop);
    };

    const startOrRestart = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (!visible) return;
      if (animate) {
        frameId = requestAnimationFrame(loop);
      } else {
        draw(null);
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const devicePixelRatio = window.devicePixelRatio >= 1 ? window.devicePixelRatio : 1;
      const nextWidth = Math.round(entry.contentRect.width * devicePixelRatio);
      const nextHeight = Math.round(entry.contentRect.height * devicePixelRatio);
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      canvas.width = width;
      canvas.height = height;
      if (!animate && visible) draw(null);
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry || entry.isIntersecting === visible) return;
      visible = entry.isIntersecting;
      startOrRestart();
    });
    intersectionObserver.observe(container);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      animate = !event.matches;
      startOrRestart();
    };
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    startOrRestart();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [geometry]);

  return resolvedStory ? (
    <div ref={containerRef} className={cn(className)}>
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  ) : null;
};
