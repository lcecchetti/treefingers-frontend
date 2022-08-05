import { Spinner, Text, Button, Link } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import { ApiError, PageIntro } from 'components/common';
import { FaEdit, FaSeedling, FaTimes } from 'react-icons/fa';
import ForestActions from 'components/forest/ForestActions';
import { getStoryNewUrl } from 'lib/helper/story';
import { useCurrentUser } from 'lib/auth/currentUser';
import { useState } from 'react';
import ForestNew from '../ForestNew';

export const QUERY_FOREST = gql`
  query forest($filter: FilterForestInput!) {
    forest(filter: $filter) {
      id
      name
      about
      excerpt
      storiesCount
      commentsCount
      membersCount
      isEditable
      currentUserMembership {
        id
      }
    }
  }
`;

const ForestView = ({ className, forest }) => {
  const { currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  const { data, loading, error } = useQuery(QUERY_FOREST, { 
    variables: { 
      filter: { id: { eq: forest.id } },
    },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  return (
    <div className={className}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {!isEditing && 
        <>
          <PageIntro className="flex flex-col gap-sm">
            <div className="flex justify-between gap-sm flex-col md:flex-row md:items-center">
              <div className="flex gap-md justify-start items-center">
                <Text variant="pageTitle" className="break-words">{data.forest.name}</Text>
                {data.forest.isEditable &&
                  <FaEdit className="text-lg cursor-pointer" onClick={() => setIsEditing(true)} />
                }
              </div>

              <div className="flex gap-md justify-between">
                <Button as={Link} icon={FaSeedling} href={getStoryNewUrl(data.forest)}>Plant</Button>
                <ForestActions forest={data.forest} />
              </div>
            </div>
            <Text variant="p" className="whitespace-pre-wrap break-words w-full">{data.forest.about}</Text>
          </PageIntro>
          {forest.storiesCount === 0 &&
            <Text>I see too much blank space on this page, let's plant some stories!</Text>
          }
          <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" filter={{ forest: { eq: data.forest.id } }} sort={{ likesCount: 'DESC' }} />
        </>
      }

      {isEditing &&
        <div className="flex flex-col gap-md w-full my-md">
          <div className="flex gap-md justify-between items-center">
            <Text variant="h2">Edit your forest</Text>
            <FaTimes className="text-xl cursor-pointer" onClick={() => setIsEditing(false)} />
          </div>
          <ForestNew className="w-full" forest={data.forest} callback={() => setIsEditing(false)} />
        </div>
      }
    </div>
  );
};

export default ForestView;

