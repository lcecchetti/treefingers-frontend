import { useEffect } from 'react';
import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList, StoryNew } from 'components/story';
import { ApiError, Like } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';

/**
 * Single forest query
 * @type {gql}
 */
export const QUERY_FOREST = gql`
  query forest($filter: FilterForestInput!) {
    forest(filter: $filter) {
      _id
      name
      about
      slug
      currentUserLike {
        _id
      }
      storiesCount
      likesCount
    }
  }
`;

const ForestView = ({ className, _id }) => {
  const currentUser = useCurrentUser();
  const { data, loading, error, refetch } = useQuery(QUERY_FOREST, { variables: { filter: { _id: { eq: _id } } } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  return (
    <div className={className}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {data &&
        <>
          <div className="flex flex-col gap-sm my-sm md:my-md">
            <div className="flex justify-between items-center">
              <Text variant="pageTitle">{data.forest.name}</Text>
              <Like entity={data.forest} />
            </div>
            <Text variant="p">{data.forest.about}</Text>
            <StoryNew forest={data.forest} />
          </div>
          <StoryList filter={{ forest: { eq: data.forest._id } }} />
        </>
      }
    </div>
  );
};

export default ForestView;

