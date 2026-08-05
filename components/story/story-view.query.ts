import { graphql } from '@/lib/graphql/generated';

// Kept in its own plain module -- see components/forest/forest-list.query.ts.
// Field selection lives in StoryContent's colocated fragment.
export const QUERY_STORY = graphql(`
  query story($filter: FilterStoryInput!) {
    story(filter: $filter) {
      ...StoryContent_story
    }
  }
`);
