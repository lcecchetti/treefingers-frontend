import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - see components/forest/forest-list.query.ts
// for why
//
// `id`/`username` are selected explicitly (in addition to being part of
// UserCard's own fragment below) because callers outside UserCard need
// them unmasked: list components use `node.id` as the React key, and
// generateStaticParams (user/[username]/page.tsx) needs `node.username` to
// build static params - see UserCard_user for the rest of the card's fields
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
