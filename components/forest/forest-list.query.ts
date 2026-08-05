import { graphql } from '@/lib/graphql/generated';

// Kept in its own plain (non-'use client') module so Server Components can
// import the query document as a real value, not an opaque client reference.
//
// `id`/`name` are selected explicitly since callers outside ForestCard need
// them unmasked (list keys, generateStaticParams) -- see ForestCard_forest
// for the rest of the card's fields.
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
