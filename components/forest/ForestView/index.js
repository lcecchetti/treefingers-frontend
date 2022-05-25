import { useEffect } from 'react';
import { Spinner, Text, Button, Link } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import { ApiError, PageIntro } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { FaSeedling } from 'react-icons/fa';
import ForestActions from 'components/forest/ForestActions';
import { getStoryNewUrl } from 'lib/helper/story';

export const QUERY_FOREST = gql`
  query forest($filter: FilterForestInput!) {
    forest(filter: $filter) {
      id
      name
      about
      storiesCount
      commentsCount
      membersCount
      currentUserMembership {
        id
      }
    }
  }
`;

const ForestView = ({ className, forest }) => {
  const { currentUser } = useCurrentUser();
  const { data, loading, error, refetch } = useQuery(QUERY_FOREST, { variables: { filter: { id: { eq: forest.id } } } });

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

      <PageIntro className="flex flex-col gap-sm">
        <div className="flex justify-between gap-sm flex-col md:flex-row md:items-center">
          <Text variant="pageTitle" className="break-words w-full">{data.forest.name}</Text>
          <div className="flex gap-sm justify-between">
            <Button as={Link} icon={FaSeedling} href={getStoryNewUrl(data.forest)}>Plant</Button>
            <ForestActions forest={data.forest} />
          </div>
        </div>
        <Text variant="p" className="whitespace-pre-wrap break-words w-full">{data.forest.about}</Text>
      </PageIntro>
      {forest.storiesCount === 0 &&
        <Text>I see too much blank space on this page, let's plant some stories!</Text>
      }
      <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 gap-md" filter={{ forest: { eq: data.forest.id } }} />
    </div>
  );
};

export default ForestView;

