'use client';

import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { buildTreeGeometry, type StoryTreeStory } from './story-tree.geometry';
import { renderTree } from './story-tree.render';

export type { StoryTreeStory };

// how long the tree takes to grow in from bare ground on first appearance
const GROWTH_DURATION_MS = 2200;

// Tree ids that already played their grow-in animation this session, so a
// chapter switch (which remounts this component under story/[id]) doesn't
// replay it when the tree itself hasn't changed.
const grownTreeIds = new Set<string>();

export function __resetGrowthCacheForTests(): void {
  grownTreeIds.clear();
}

interface StoryTreeProps {
  story?: StoryTreeStory;
  className?: string;
}

export const StoryTree = ({ story, className }: StoryTreeProps) => {
  const resolvedStory = story?.root ?? story;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resolvedStoryId = resolvedStory?.id;

  const geometry = useMemo(
    () => (resolvedStory ? buildTreeGeometry(resolvedStory) : null),
    // Keyed on id only: reflects stats as of resolution, not live updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolvedStoryId]
  );

  useEffect(() => {
    if (!geometry) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const skipGrowth = resolvedStoryId !== undefined && grownTreeIds.has(resolvedStoryId);

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animate = !reducedMotionQuery.matches;
    // Assume visible until the IntersectionObserver's first async callback.
    let visible = true;
    let width = 0;
    let height = 0;
    let frameId: number | null = null;
    // Halves draw frequency (a "quiet wind" doesn't need 60fps); rAF still
    // gets scheduled every frame so hidden-tab pausing keeps working.
    const FRAME_INTERVAL_MS = 33;
    let lastDrawTime = -Infinity;
    // Set on the first real frame so growth times from when animation
    // actually starts, not from mount.
    let growthStartTime: number | null = null;

    const draw = (time: number | null) => {
      if (width === 0 || height === 0) return;
      let growth = 1;
      if (time !== null && !skipGrowth) {
        if (growthStartTime === null) growthStartTime = time;
        const linear = Math.min(1, (time - growthStartTime) / GROWTH_DURATION_MS);
        growth = 1 - Math.pow(1 - linear, 2); // ease-out: quick start, gentle settle
      }
      // Marked grown only once fully grown, not at mount, so Strict Mode's
      // throwaway double-invoke doesn't mark it before the real run checks it.
      if (growth >= 1 && resolvedStoryId !== undefined) grownTreeIds.add(resolvedStoryId);
      renderTree(ctx, geometry, width, height, time, growth);
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
  }, [geometry, resolvedStoryId]);

  return resolvedStory ? (
    <div ref={containerRef} className={cn(className)}>
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  ) : null;
};
