import { useEffect } from 'react';
import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import { ApiError, PageIntro } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import UserFollowership from 'components/user/UserFollowership';

export const QUERY_USER = gql`
  query user($filter: FilterUserInput!) {
    user(filter: $filter) {
      id
      bio
      username
      followersCount
      currentUserFollowershipAsFollower {
        id
      }
    }
  }
`;

const UserView = ({ className, user }) => {
  const { currentUser } = useCurrentUser();
  const { data, loading, error, refetch } = useQuery(QUERY_USER, { variables: { filter: { id: { eq: user.id } } } });

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
        <div className="flex justify-between items-center">
          <Text variant="pageTitle" className="whitespace-pre-wrap w-full break-words">{data.user.username}</Text>
          <UserFollowership user={data.user} />
        </div>
        <Text variant="p" className="break-words w-full">{data.user.bio}</Text>
      </PageIntro>
      <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 gap-md" filter={{ author: { eq: data.user.id }, parent: { eq: null } }} />
    </div>
  );
};

export default UserView;

