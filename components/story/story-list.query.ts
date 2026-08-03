import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - see components/forest/forest-list.query.ts
// for why
export const QUERY_STORIES = graphql(`
  query stories($filter: FilterStoryInput, $sort: SortStoryInput, $first: Int, $after: String) {
    stories(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          __typename
          id
          title
          excerpt
          createdAt
          depth
          parent {
            id
            likesCount
            descendentsCount
          }
          author {
            id
            username
          }
          tags
          likesCount
          commentsCount
          descendentsCount
          currentUserLike {
            id
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        totalCount
      }
    }
  }
`);
