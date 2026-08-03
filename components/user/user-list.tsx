'use client';

import { Suspense, useEffect, useTransition } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';
import { InfiniteScroll } from '@/components/common';
import { UserCard } from './user-card';
import { Spinner } from '@/components/ui';
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

const UserListContent = ({ className, filter, sort, first = 12, setTotalCount }: UserListProps) => {
  const { currentUser } = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const { data, error, fetchMore } = useSuspenseQuery(QUERY_USERS, {
    variables: { filter, first, sort },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    errorPolicy: 'all',
  });

  useEffect(() => {
    setTotalCount && setTotalCount(data?.users.pageInfo.totalCount);
  }, [data?.users.pageInfo.totalCount]);

  return (!!data?.users.edges?.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => startTransition(() => { fetchMore({ variables: { after: data?.users.pageInfo.endCursor }, ...opt }); })} loading={isPending} error={error} hasMore={data?.users.pageInfo.hasNextPage}>
      {data.users.edges.map(({ node }) => (
        <UserCard key={node.id} user={node} />
      ))}
    </InfiniteScroll>
  );
};

export const UserList = (props: UserListProps) => (
  <Suspense fallback={<Spinner className="my-lg" />}>
    <UserListContent {...props} />
  </Suspense>
);
