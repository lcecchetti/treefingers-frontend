import { StoryChaptersView } from '@/components/story/story-chapters';
import { publicQuery } from '@/lib/apollo/client';
import { QUERY_STORIES } from './story-list.query';

interface StoryChaptersStaticProps {
  className?: string;
  parent: { id: string };
  first?: number;
}

// Server-rendered, cookie-free counterpart to StoryChapters, used as
// ClientOnly's SSR fallback so it matches the hydrated view exactly (see
// components/common/client-only.tsx).
//
// Deliberately not exported from ./index -- it pulls in the RSC-only
// publicQuery chain, which breaks the client bundle if re-exported through
// a barrel with 'use client' components. Import this file directly.
export const StoryChaptersStatic = async ({ className, parent, first = 10 }: StoryChaptersStaticProps) => {
  const edges = await publicQuery({
    query: QUERY_STORIES,
    variables: { filter: { parent: { eq: parent.id } }, first, sort: { likesCount: 'DESC' } },
  })
    .then(({ data }) => data?.stories.edges ?? [])
    .catch(() => []);

  return <StoryChaptersView className={className} parentId={parent.id} edges={edges} />;
};
