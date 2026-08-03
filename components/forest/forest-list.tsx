'use client';

import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ForestCard } from '@/components/forest/forest-card';
import { InfiniteScroll } from '@/components/common';
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

export const ForestList = ({ className, filter, sort, first = 12, setTotalCount }: ForestListProps) => {
  const { currentUser } = useCurrentUser();

  const { data, loading, error, fetchMore } = useQuery(QUERY_FORESTS, {
    variables: { filter, first, sort },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    setTotalCount && !loading && setTotalCount(data?.forests.pageInfo.totalCount);
  }, [data?.forests.pageInfo.totalCount]);

  return (!!data?.forests.edges?.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => fetchMore({ variables: { after: data?.forests.pageInfo.endCursor }, ...opt })} loading={loading} error={error} hasMore={data?.forests.pageInfo.hasNextPage}>
      {data.forests.edges.map(({ node }) => (
        <ForestCard key={node.id} forest={node} />
      ))}
    </InfiniteScroll>
  );
};
