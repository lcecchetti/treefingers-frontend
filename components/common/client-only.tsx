'use client';

import { Suspense, useEffect, useState, type ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// renders `fallback` during SSR and on the first client render (so server
// and client markup match, avoiding a hydration error, and so `children`'s
// hooks - e.g. a cookie-dependent useSuspenseQuery - never execute during
// the server render). Use this to keep a route static/ISR-eligible while a
// child's own data fetching only ever runs in the browser.
//
// Once mounted, `children` is rendered inside a Suspense boundary whose
// fallback is the SAME `fallback` node. `children` reliably suspends on its
// first client render (its useSuspenseQuery reads from the browser Apollo
// client, whose cache is always cold here - it never shares data with the
// RSC-only client that produced `fallback`, see lib/apollo/client.ts).
// Reusing `fallback` as the Suspense fallback means that first suspension
// is visually a no-op (same content stays on screen) instead of a flash
// down to a generic spinner. Wrapping the mount flip in startTransition was
// tried first and does NOT work here - React only preserves already-visible
// content across a transition for a Suspense boundary that's being updated
// in place; a boundary suspending for the very first time (which is what
// happens the moment `children` mounts) shows its own fallback immediately
// regardless. Verified in a real browser: without this Suspense structure,
// `.animate-spin` appears ~25ms after the swap, well before any transition
// could matter.
//
// For this to work, `children` must not carry its own inner Suspense
// boundary above the query that suspends - see e.g. ForestListContent
// (exported unwrapped, unlike the default Suspense-wrapped ForestList) for
// the sibling half of this pattern.
export const ClientOnly = ({ children, fallback = null }: ClientOnlyProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return fallback;

  return <Suspense fallback={fallback}>{children}</Suspense>;
};
