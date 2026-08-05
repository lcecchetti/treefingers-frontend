import { ForestCard } from '@/components/forest/forest-card';
import { publicQuery } from '@/lib/apollo/client';
import type { ForestsQueryVariables } from '@/lib/graphql/generated/graphql';
import { QUERY_FORESTS } from './forest-list.query';

interface ForestListStaticProps {
  className?: string;
  filter?: ForestsQueryVariables['filter'];
  sort?: ForestsQueryVariables['sort'];
  first?: number;
}

// server-rendered, cookie-free counterpart to ForestList: used as ClientOnly's
// SSR/first-paint fallback so crawlers and pre-hydration visitors see real
// forests instead of a spinner, while staying ISR-safe (publicQuery never
// calls next/headers cookies()). The live ForestList takes over on mount for
// personalization and infinite scroll.
//
// Deliberately NOT exported from ./index - it pulls in the RSC-only
// publicQuery/registerApolloClient chain, which breaks the client bundle if
// re-exported through the same barrel as 'use client' components (see
// lib/apollo/client.ts). Import this file directly from Server Components.
export const ForestListStatic = async ({ className, filter, sort, first = 12 }: ForestListStaticProps) => {
  const edges = await publicQuery({ query: QUERY_FORESTS, variables: { filter, sort, first } })
    .then(({ data }) => data?.forests.edges ?? [])
    .catch(() => []);

  return edges.length > 0 && (
    <div className={className}>
      {edges.map(({ node }) => (
        <ForestCard key={node.id} forest={node} />
      ))}
    </div>
  );
};
