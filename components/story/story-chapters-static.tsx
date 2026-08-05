import { StoryChaptersView } from '@/components/story/story-chapters';
import { publicQuery } from '@/lib/apollo/client';
import { QUERY_STORIES } from './story-list.query';

interface StoryChaptersStaticProps {
  className?: string;
  parent: { id: string };
  first?: number;
}

// server-rendered, cookie-free counterpart to StoryChapters: used as
// ClientOnly's SSR/first-paint fallback on the story page so crawlers and
// pre-hydration visitors see the same carousel as the live, hydrated view -
// see StoryChaptersView (components/story/story-chapters.tsx) for the shared
// presentation and components/common/client-only.tsx for why the two must
// match exactly.
//
// Deliberately NOT exported from ./index - it pulls in the RSC-only
// publicQuery/registerApolloClient chain, which breaks the client bundle if
// re-exported through the same barrel as 'use client' components (see
// lib/apollo/client.ts and story-list-static.tsx). Import this file directly
// from Server Components.
export const StoryChaptersStatic = async ({ className, parent, first = 10 }: StoryChaptersStaticProps) => {
  const edges = await publicQuery({
    query: QUERY_STORIES,
    variables: { filter: { parent: { eq: parent.id } }, first, sort: { likesCount: 'DESC' } },
  })
    .then(({ data }) => data?.stories.edges ?? [])
    .catch(() => []);

  return <StoryChaptersView className={className} parentId={parent.id} edges={edges} />;
};
