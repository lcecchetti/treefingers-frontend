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
    let width = 0;
    let height = 0;
    let frameId: number | null = null;

    const draw = (time: number | null) => {
      if (width === 0 || height === 0) return;
      renderTree(ctx, geometry, width, height, time);
    };

    const loop = (time: number) => {
      draw(time);
      frameId = requestAnimationFrame(loop);
    };

    const startOrRestart = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
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
      if (!animate) draw(null);
    });
    resizeObserver.observe(container);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      animate = !event.matches;
      startOrRestart();
    };
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    startOrRestart();

    return () => {
      resizeObserver.disconnect();
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
