import { useEffect, useState } from 'react';
import { Spinner, Text, Button } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList, StoryNew } from 'components/story';
import { ApiError } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { FaSeedling, FaTimes } from 'react-icons/fa';
import ForestActions from 'components/forest/ForestActions';

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
          <div className="flex flex-col gap-sm my-sm lg:my-md">
            <div className="flex justify-between gap-sm flex-col md:flex-row md:items-center">
              <Text variant="pageTitle">{data.forest.name}</Text>
              <div className="flex gap-sm justify-between">
                <Button icon={FaSeedling} onClick={() => setIsWritingStory(true)}>Plant a story</Button>
                <ForestActions forest={data.forest} />
              </div>
            </div>
            <Text variant="p">{data.forest.about}</Text>
          </div>
          {isWritingStory &&
            <div className="flex flex-col gap-md">
              <div className="flex flex-col gap-sm">
                <div className="flex justify-between items-center">
                  <Text className="uppercase text-md font-bold" as="h3">Plant a story</Text>
                  <FaTimes className="cursor-pointer" onClick={() => setIsWritingStory(false)} />
                </div>
                <Text as="p">
                  I see too much blank space down here...
                  <br/>
                  Some writings, and a captivating title, that's all it takes for a good seed.
                </Text>
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

