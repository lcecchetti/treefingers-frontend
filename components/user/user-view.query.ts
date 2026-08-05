import { graphql } from '@/lib/graphql/generated';

// Kept in its own plain module -- see components/forest/forest-list.query.ts.
// Field selection lives in UserContent's colocated fragment.
export const QUERY_USER = graphql(`
  query user($filter: FilterUserInput!) {
    user(filter: $filter) {
      ...UserContent_user
    }
  }
`);
