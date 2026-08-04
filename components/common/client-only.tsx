'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// renders `fallback` during SSR and on the first client render (so server
// and client markup match, avoiding a hydration error), then swaps to
// `children` once mounted. Use this to keep a route static/ISR-eligible
// while a child's own data fetching (e.g. cookie-dependent personalization)
// only ever runs in the browser, never during the server render.
export const ClientOnly = ({ children, fallback = null }: ClientOnlyProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : fallback;
};
