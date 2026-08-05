'use client';

import { Suspense, useEffect, useState, type ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Renders `fallback` during SSR and the first client render (avoids
// hydration mismatches and keeps children's hooks, e.g. useSuspenseQuery,
// from running server-side), keeping the route static/ISR-eligible while a
// child's data fetching stays browser-only.
//
// Once mounted, `children` renders inside a Suspense boundary using the same
// `fallback` node, so its first suspension (cold browser Apollo cache) is a
// visual no-op instead of a flash to a spinner. startTransition doesn't
// achieve this: React only preserves visible content across a transition for
// a boundary updating in place, not one suspending for the first time.
//
// `children` must not have its own inner Suspense boundary above the query
// that suspends -- see ForestListContent for the unwrapped sibling half of
// this pattern.
export const ClientOnly = ({ children, fallback = null }: ClientOnlyProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return fallback;

  return <Suspense fallback={fallback}>{children}</Suspense>;
};
