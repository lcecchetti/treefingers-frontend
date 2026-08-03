import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - see forest-list.query.ts for why
export const QUERY_FOREST = graphql(`
  query forest($filter: FilterForestInput!) {
    forest(filter: $filter) {
      id
      name
      about
      excerpt
      storiesCount
      commentsCount
      membersCount
      isEditable
      currentUserMembership {
        id
      }
    }
  }
`);
