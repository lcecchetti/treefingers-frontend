import { StoryCard } from '@/components/story/story-card';
import { publicQuery } from '@/lib/apollo/client';
import type { StoriesQueryVariables } from '@/lib/graphql/generated/graphql';
import { QUERY_STORIES } from './story-list.query';

interface StoryListStaticProps {
  className?: string;
  filter?: StoriesQueryVariables['filter'];
  sort?: StoriesQueryVariables['sort'];
  first?: number;
}

// Server-rendered, cookie-free counterpart to StoryList, used as ClientOnly's
// SSR fallback; StoryList takes over on mount for personalization/infinite scroll.
//
// Deliberately not exported from ./index -- it pulls in the RSC-only
// publicQuery chain, which breaks the client bundle if re-exported through
// a barrel with 'use client' components. Import this file directly.
export const StoryListStatic = async ({ className, filter, sort, first = 12 }: StoryListStaticProps) => {
  const edges = await publicQuery({ query: QUERY_STORIES, variables: { filter, sort, first } })
    .then(({ data }) => data?.stories.edges ?? [])
    .catch(() => []);

  return edges.length > 0 && (
    <div className={className}>
      {edges.map(({ node }) => (
        <StoryCard key={node.id} story={node} />
      ))}
    </div>
  );
};
