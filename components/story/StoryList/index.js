import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';
import { InfiniteScroll } from 'components/common';
import { StoryCard, FRAGMENT_STORY_CARD_FIELDS } from 'components/story';

/**
 * Story list query
 * @type {gql}
 */
export const QUERY_STORIES = gql`
  query stories($filter: FilterStoryInput, $sort: SortInput, $first: Int, $after: String) {
    stories(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        node {
          ...StoryCardFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${FRAGMENT_STORY_CARD_FIELDS}
`;

const StoryList = ({ className, filter, first = 10 }) => {
  const currentUser = useCurrentUser();

  const { data, loading, error, refetch, fetchMore } = useQuery(QUERY_STORIES, {
    variables: { filter, first },
  });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  return (
    <InfiniteScroll className={clsx('grid xl:grid-cols-3 sm:grid-cols-2 gap-md', className)} onLoadMore={() => fetchMore({ variables: { after: data?.stories.pageInfo.endCursor } })} loading={loading} error={error} hasMore={data?.stories.pageInfo.hasNextPage}>
      {data?.stories && data.stories.edges.map(({ node }) => (
        <StoryCard key={node._id} story={node} />
      ))}
    </InfiniteScroll>
  );
};

export default StoryList;

