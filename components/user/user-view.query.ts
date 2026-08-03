import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - see components/forest/forest-list.query.ts
// for why
export const QUERY_USER = graphql(`
  query user($filter: FilterUserInput!) {
    user(filter: $filter) {
      id
      bio
      username
      followersCount
      currentUserFollowershipAsFollower {
        id
      }
    }
  }
`);
