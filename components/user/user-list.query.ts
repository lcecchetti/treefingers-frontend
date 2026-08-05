import { graphql } from '@/lib/graphql/generated';

// Kept in its own plain module -- see components/forest/forest-list.query.ts.
//
// `id`/`username` are selected explicitly since callers outside UserCard
// need them unmasked (list keys, generateStaticParams) -- see UserCard_user
// for the rest of the card's fields.
export const QUERY_USERS = graphql(`
  query users($filter: FilterUserInput, $sort: SortUserInput, $first: Int, $after: String) {
    users (filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          username
          ...UserCard_user
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
