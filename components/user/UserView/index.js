import { useEffect } from 'react';
import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import { ApiError, PageIntro } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import UserFollowership from 'components/user/UserFollowership';

/**
 * Single user query
 * @type {gql}
 */
export const QUERY_USER = gql`
  query user($filter: FilterUserInput!) {
    user(filter: $filter) {
      _id
      bio
      username
      followersCount
      currentUserFollowership {
        _id
      }
    }
  }
`;

const UserView = ({ className, _id }) => {
  const { currentUser } = useCurrentUser();
  const { data, loading, error, refetch } = useQuery(QUERY_USER, { variables: { filter: { _id: { eq: _id } } } });

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
          <PageIntro className="flex flex-col gap-sm">
            <div className="flex justify-between items-center">
              <Text variant="pageTitle" className="whitespace-pre-wrap w-full break-words">{data.user.username}</Text>
              <UserFollowership user={data.user} />
            </div>
            <Text variant="p" className="break-words w-full">{data.user.bio}</Text>
          </PageIntro>
          <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 gap-md" filter={{ author: { eq: data.user._id }, root: null }} />
        </>
      }
    </div>
  );
};

export default UserView;

