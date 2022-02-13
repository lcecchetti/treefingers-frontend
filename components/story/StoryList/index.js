import { useEffect } from 'react';
import { Spinner } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';
import { ApiError } from 'components/common';
import { StoryCard, FRAGMENT_STORY_CARD_FIELDS } from 'components/story';

/**
 * Story list query
 * @type {gql}
 */
export const QUERY_STORIES = gql`
  query stories($filter: FilterStoryInput) {
    stories(filter: $filter) {
      edges {
        node {
          ...StoryCardFields
        }
      }
    }
  }
  ${FRAGMENT_STORY_CARD_FIELDS}
`;

const StoryList = ({ className, filter }) => {
  const currentUser = useCurrentUser();

  const { data, loading, error, refetch } = useQuery(QUERY_STORIES, {
    variables: { filter },
  });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  return (
    <div className={clsx('grid xl:grid-cols-3 sm:grid-cols-2 gap-md', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {data?.stories && data.stories.edges.map(({ node }) => (
        <StoryCard key={node._id} story={node} />
      ))}
    </div>
  );
};

export default StoryList;

