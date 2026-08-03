import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - see components/forest/forest-list.query.ts
// for why
export const QUERY_USERS = graphql(`
  query users($filter: FilterUserInput, $sort: SortUserInput, $first: Int, $after: String) {
    users (filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          excerpt
          username
          followersCount
          currentUserFollowershipAsFollower {
            id
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        totalCount
      }
    }
  }
`);
