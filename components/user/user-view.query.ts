import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - see components/forest/forest-list.query.ts
// for why. Field selection lives in UserContent's colocated fragment - see
// components/user/user-content.tsx
export const QUERY_USER = graphql(`
  query user($filter: FilterUserInput!) {
    user(filter: $filter) {
      ...UserContent_user
    }
  }
`);
