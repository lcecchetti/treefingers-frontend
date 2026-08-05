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

// server-rendered, cookie-free counterpart to StoryList: used as ClientOnly's
// SSR/first-paint fallback so crawlers and pre-hydration visitors see real
// stories instead of a spinner, while staying ISR-safe (publicQuery never
// calls next/headers cookies()). The live StoryList takes over on mount for
// personalization and infinite scroll.
//
// Deliberately NOT exported from ./index - it pulls in the RSC-only
// publicQuery/registerApolloClient chain, which breaks the client bundle if
// re-exported through the same barrel as 'use client' components (see
// lib/apollo/client.ts). Import this file directly from Server Components.
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
