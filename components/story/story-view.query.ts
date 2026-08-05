import { graphql } from '@/lib/graphql/generated';

// kept in its own plain module (no 'use client') so Server Components can
// import the query document directly - see components/forest/forest-list.query.ts
// for why. Field selection lives in StoryContent's colocated fragment - see
// components/story/story-content.tsx
export const QUERY_STORY = graphql(`
  query story($filter: FilterStoryInput!) {
    story(filter: $filter) {
      ...StoryContent_story
    }
  }
`);
