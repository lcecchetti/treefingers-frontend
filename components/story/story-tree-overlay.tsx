'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { QUERY_STORY_TREE_SHAPE } from './story-tree-overlay.query';
import { StoryTree, type StoryTreeStory } from './story-tree';

// Mounted in an ancestor layout (app/(default)/story/layout.tsx) so it
// survives navigation between story/[id] values. Derives storyId from the
// pathname rather than a prop for that reason; excludes story/new.
export const StoryTreeOverlay = () => {
  const pathname = usePathname();
  const match = pathname.match(/^\/story\/([^/]+)$/);
  const storyId = match && match[1] !== 'new' ? match[1] : undefined;

  const { data } = useQuery(QUERY_STORY_TREE_SHAPE, {
    variables: { filter: { id: { eq: storyId ?? '' } } },
    skip: !storyId,
  });

  // Hold the last-resolved story so a chapter switch (Apollo drops `data`
  // mid-fetch) doesn't flash the tree away and replay its grow-in animation.
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
