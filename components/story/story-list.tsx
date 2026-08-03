'use client';

import { Suspense, useEffect, useTransition } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';
import { InfiniteScroll } from '@/components/common';
import { StoryCard } from '@/components/story/story-card';
import { Spinner } from '@/components/ui';
import { useCurrentUser } from '@/lib/auth/current-user';
import type { StoriesQueryVariables } from '@/lib/graphql/generated/graphql';
import { QUERY_STORIES } from './story-list.query';

interface StoryListProps {
  className?: string;
  filter?: StoriesQueryVariables['filter'];
  sort?: StoriesQueryVariables['sort'];
  first?: number;
  setTotalCount?: (totalCount: number | undefined) => void;
}

const StoryListContent = ({ className, filter, sort, first = 12, setTotalCount }: StoryListProps) => {
  const { currentUser } = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const { data, error, fetchMore } = useSuspenseQuery(QUERY_STORIES, {
    variables: { filter, first, sort },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    errorPolicy: 'all',
  });

  useEffect(() => {
    setTotalCount && setTotalCount(data?.stories.pageInfo.totalCount);
  }, [data?.stories.pageInfo.totalCount]);

  return (!!data?.stories.edges?.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => startTransition(() => { fetchMore({ variables: { after: data?.stories.pageInfo.endCursor }, ...opt }); })} loading={isPending} error={error} hasMore={data?.stories.pageInfo.hasNextPage}>
      {data.stories.edges.map(({ node }) => (
        <StoryCard key={node.id} story={node} />
      ))}
    </InfiniteScroll>
  );
};

export const StoryList = (props: StoryListProps) => (
  <Suspense fallback={<Spinner className="my-lg" />}>
    <StoryListContent {...props} />
  </Suspense>
);
