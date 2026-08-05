import { graphql } from '@/lib/graphql/generated';

// kept separate from StoryContent's fragment (components/story/story-content.tsx):
// this only needs a story's (or its root's) tree-shape stats, not the full
// chapter content field set - see components/story/story-tree-overlay.tsx
export const QUERY_STORY_TREE_SHAPE = graphql(`
  query storyTreeShape($filter: FilterStoryInput!) {
    story(filter: $filter) {
      id
      descendantsCount
      childrenCount
      depth
      likesCount
      commentsCount
      root {
        id
        descendantsCount
        childrenCount
        depth
        likesCount
        commentsCount
      }
    }
  }
`);
