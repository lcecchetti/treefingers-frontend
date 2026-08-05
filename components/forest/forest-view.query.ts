import { graphql } from '@/lib/graphql/generated';

// Kept in its own plain module -- see forest-list.query.ts. Field selection
// lives in ForestContent's colocated fragment.
export const QUERY_FOREST = graphql(`
  query forest($filter: FilterForestInput!) {
    forest(filter: $filter) {
      ...ForestContent_forest
    }
  }
`);
