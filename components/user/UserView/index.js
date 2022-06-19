import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import { ApiError, PageIntro } from 'components/common';
import UserFollowership from 'components/user/UserFollowership';
import { useCurrentUser } from 'lib/auth/currentUser';

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

  const { data, loading, error } = useQuery(QUERY_USER, { 
    variables: { filter: { id: { eq: user.id } } },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

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
      <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 gap-md" filter={{ author: { eq: data.user.id }, parent: { eq: null } }} sort={{ likesCount:'DESC' }} />
    </div>
  );
};

export default UserView;

