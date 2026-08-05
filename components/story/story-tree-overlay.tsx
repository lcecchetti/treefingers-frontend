'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { QUERY_STORY_TREE_SHAPE } from './story-tree-overlay.query';
import { StoryTree, type StoryTreeStory } from './story-tree';

// lives in app/(default)/story/layout.tsx, an ancestor of the story/[id]
// route rather than a layout colocated with it -- confirmed via e2e testing
// that a layout defined AT the same level as [id] does not survive
// navigation between different [id] values (Next.js treats that whole
// dynamic segment, including any layout file living inside it, as the unit
// that changes on navigation; only a genuine ancestor is preserved).
// Deriving the current story id from the pathname, rather than a prop,
// keeps this self-contained regardless of exactly where it's mounted; the
// only thing to exclude is story/new, which lives under the same layout but
// isn't a story to render a tree for.
export const StoryTreeOverlay = () => {
  const pathname = usePathname();
  const match = pathname.match(/^\/story\/([^/]+)$/);
  const storyId = match && match[1] !== 'new' ? match[1] : undefined;

  const { data } = useQuery(QUERY_STORY_TREE_SHAPE, {
    variables: { filter: { id: { eq: storyId ?? '' } } },
    skip: !storyId,
  });

  // Apollo drops `data` back to undefined while a query with new variables
  // is in flight, unless it's already fully cached. Chapters of the same
  // story share a root, so without holding onto the last-resolved story
  // here, a chapter switch would flash the tree to nothing and its grow-in
  // animation would replay once the new chapter's data lands.
  const [story, setStory] = useState<StoryTreeStory | undefined>(undefined);
  useEffect(() => {
    if (data?.story) setStory({ ...data.story, root: data.story.root ?? undefined });
  }, [data]);

  if (!storyId) return null;

  return (
    <StoryTree
      story={story}
      className="hidden lg:block h-screen w-full lg:fixed top-0 left-0 lg:-left-1/4"
    />
  );
};
