import { useEffect, useState } from 'react';
import { Spinner, Text, Button } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList, StoryNew } from 'components/story';
import { ApiError } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { FaSeedling, FaTimes } from 'react-icons/fa';
import { ForestActions } from 'components/forest';

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
      title
      storiesCount
      commentsCount
      membersCount
      currentUserMembership {
        _id
      }
    }
  }
`;

const ForestView = ({ className, _id }) => {
  const currentUser = useCurrentUser();
  const [isWritingStory, setIsWritingStory] = useState(false);
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
            <div className="flex justify-between sm:items-center flex-col sm:flex-row">
              <Text variant="pageTitle">{data.forest.title}</Text>
              <div className="flex gap-sm justify-between">
                <Button icon={FaSeedling} onClick={() => setIsWritingStory(true)}>Plant a story</Button>
                <ForestActions forest={data.forest} />
              </div>
            </div>
            <Text variant="p">{data.forest.about}</Text>
          </div>
          {isWritingStory &&
            <div>
              <div className="flex justify-between items-center">
                <Text variant="subtitle">Plant a story</Text>
                <FaTimes className="cursor-pointer" onClick={() => setIsWritingStory(false)} />
              </div>
              <StoryNew forest={data.forest} />
            </div>
          }
          {!isWritingStory &&
            <StoryList filter={{ forest: { eq: data.forest._id } }} />
          }
        </>
      }
    </div>
  );
};

export default ForestView;

