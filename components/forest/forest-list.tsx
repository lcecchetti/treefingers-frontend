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

// Exported unwrapped so ClientOnly can be the Suspense boundary catching its
// first-mount suspension (see components/common/client-only.tsx). Use this
// as ClientOnly's children; use `ForestList` elsewhere.
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
