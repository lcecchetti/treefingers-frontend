'use client';

import { useMemo } from 'react';
import type { NormalizedCacheObject } from '@apollo/client';
import { initializeApollo } from '@/lib/apollo/client';

interface ApolloHydrationProps {
  state: NormalizedCacheObject;
}

// merges Server-Component-fetched Apollo cache data into the client-side
// singleton during render, before any descendant useQuery reads the cache —
// mirrors the old getStaticProps + __APOLLO_STATE__ hydration, just without
// a shared _app.tsx entry point to hang the initial state off of
export const ApolloHydration = ({ state }: ApolloHydrationProps) => {
  useMemo(() => initializeApollo(state), [state]);
  return null;
};
