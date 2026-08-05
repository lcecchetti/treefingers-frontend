import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - see components/forest/forest-list.query.ts
// for why
//
// `id` is selected explicitly (in addition to being part of StoryCard's own
// fragment below) because callers outside StoryCard need it unmasked: list
// components use `node.id` as the React key, and generateStaticParams
// (story/[id]/page.tsx) needs it to build static params - see
// StoryCard_story for the rest of the card's fields
export const QUERY_STORIES = graphql(`
  query stories($filter: FilterStoryInput, $sort: SortStoryInput, $first: Int, $after: String) {
    stories(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          ...StoryCard_story
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
