'use client';

import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { InfiniteScroll } from '@/components/common';
import { UserCard } from './user-card';
import { useCurrentUser } from '@/lib/auth/current-user';
import type { UsersQueryVariables } from '@/lib/graphql/generated/graphql';
import { QUERY_USERS } from './user-list.query';

interface UserListProps {
  className?: string;
  filter?: UsersQueryVariables['filter'];
  sort?: UsersQueryVariables['sort'];
  first?: number;
  setTotalCount?: (totalCount: number | undefined) => void;
}

export const UserList = ({ className, filter, sort, first = 12, setTotalCount }: UserListProps) => {
  const { currentUser } = useCurrentUser();

  const { data, loading, error, fetchMore } = useQuery(QUERY_USERS, {
    variables: { filter, first, sort },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    setTotalCount && !loading && setTotalCount(data?.users.pageInfo.totalCount);
  }, [data?.users.pageInfo.totalCount]);

  return (!!data?.users.edges?.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => fetchMore({ variables: { after: data?.users.pageInfo.endCursor }, ...opt })} loading={loading} error={error} hasMore={data?.users.pageInfo.hasNextPage}>
      {data.users.edges.map(({ node }) => (
        <UserCard key={node.id} user={node} />
      ))}
    </InfiniteScroll>
  );
};
