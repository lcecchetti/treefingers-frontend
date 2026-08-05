import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - a 'use client' file's exports don't
// cross the RSC boundary as the real value, they get replaced with an opaque
// client reference, which broke `apolloClient.query({ query: QUERY_FORESTS })`
// calls from app/ pages when this lived inside forest-list.tsx
//
// `id`/`name` are selected explicitly (in addition to being part of
// ForestCard's own fragment below) because callers outside ForestCard need
// them unmasked: list components use `node.id` as the React key, and
// generateStaticParams (forest/[name]/page.tsx) needs `node.name` to build
// static params - see ForestCard_forest for the rest of the card's fields
export const QUERY_FORESTS = graphql(`
  query forests($filter: FilterForestInput, $sort: SortForestInput, $first: Int, $after: String) {
    forests(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          name
          ...ForestCard_forest
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
