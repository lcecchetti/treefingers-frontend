import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - see components/forest/forest-list.query.ts
// for why
export const QUERY_STORY = graphql(`
  query story($filter: FilterStoryInput!) {
    story(filter: $filter) {
      __typename
      id
      title
      content
      excerpt
      createdAt
      author {
        id
        username
      }
      tags
      parent {
        id
      }
      root {
        id
        title
        likesCount
        descendentsCount
      }
      forest {
        id
        name
      }
      likesCount
      commentsCount
      descendentsCount
      childrenCount
      currentUserLike {
        id
      }
      isEditable
    }
  }
`);
