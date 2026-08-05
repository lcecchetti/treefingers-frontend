'use client';

import { Suspense, useEffect, useTransition } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';
import { ForestCard } from '@/components/forest/forest-card';
import { InfiniteScroll } from '@/components/common';
import { Spinner } from '@/components/ui';
import { useCurrentUser } from '@/lib/auth/current-user';
import type { ForestsQueryVariables } from '@/lib/graphql/generated/graphql';
import { QUERY_FORESTS } from './forest-list.query';

interface ForestListProps {
  className?: string;
  filter?: ForestsQueryVariables['filter'];
  sort?: ForestsQueryVariables['sort'];
  first?: number;
  setTotalCount?: (totalCount: number | undefined) => void;
}

// exported unwrapped (no Suspense of its own) so ClientOnly can be the
// Suspense boundary that catches its first-mount suspension, with the
// pre-rendered static content as the fallback - see components/common/client-only.tsx.
// Reach for this instead of the default `ForestList` export when rendering
// directly as ClientOnly's children; keep using `ForestList` (Suspense +
// generic spinner) for nested reuse away from a ClientOnly boundary.
export const ForestListContent = ({ className, filter, sort, first = 12, setTotalCount }: ForestListProps) => {
  const { currentUser } = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const { data, error, fetchMore } = useSuspenseQuery(QUERY_FORESTS, {
    variables: { filter, first, sort },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    errorPolicy: 'all',
  });

  useEffect(() => {
    setTotalCount && setTotalCount(data?.forests.pageInfo.totalCount);
  }, [data?.forests.pageInfo.totalCount]);

  return (!!data?.forests.edges?.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => startTransition(() => { fetchMore({ variables: { after: data?.forests.pageInfo.endCursor }, ...opt }); })} loading={isPending} error={error} hasMore={data?.forests.pageInfo.hasNextPage}>
      {data.forests.edges.map(({ node }) => (
        <ForestCard key={node.id} forest={node} />
      ))}
    </InfiniteScroll>
  );
};

export const ForestList = (props: ForestListProps) => (
  <Suspense fallback={<Spinner className="my-lg" />}>
    <ForestListContent {...props} />
  </Suspense>
);
