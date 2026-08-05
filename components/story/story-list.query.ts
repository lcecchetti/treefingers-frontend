import { graphql } from '@/lib/graphql/generated';

// Kept in its own plain module -- see components/forest/forest-list.query.ts.
//
// `id` is selected explicitly since callers outside StoryCard need it
// unmasked (list keys, generateStaticParams) -- see StoryCard_story for the
// rest of the card's fields.
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
