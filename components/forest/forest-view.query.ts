import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - see forest-list.query.ts for why.
// Field selection lives in ForestContent's colocated fragment - see
// components/forest/forest-content.tsx
export const QUERY_FOREST = graphql(`
  query forest($filter: FilterForestInput!) {
    forest(filter: $filter) {
      ...ForestContent_forest
    }
  }
`);
