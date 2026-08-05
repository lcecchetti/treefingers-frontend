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

// Server-rendered, cookie-free counterpart to ForestList, used as ClientOnly's
// SSR fallback; ForestList takes over on mount for personalization/infinite scroll.
//
// Deliberately not exported from ./index -- it pulls in the RSC-only
// publicQuery chain, which breaks the client bundle if re-exported through
// a barrel with 'use client' components. Import this file directly.
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
