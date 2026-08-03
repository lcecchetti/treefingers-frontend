import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - a 'use client' file's exports don't
// cross the RSC boundary as the real value, they get replaced with an opaque
// client reference, which broke `apolloClient.query({ query: QUERY_FORESTS })`
// calls from app/ pages when this lived inside forest-list.tsx
export const QUERY_FORESTS = graphql(`
  query forests($filter: FilterForestInput, $sort: SortForestInput, $first: Int, $after: String) {
    forests(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          name
          excerpt
          commentsCount
          membersCount
          currentUserMembership {
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
