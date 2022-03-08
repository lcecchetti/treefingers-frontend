import { useEffect } from 'react';
import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import { ApiError } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';

/**
 * Single user query
 * @type {gql}
 */
export const QUERY_USER = gql`
  query user($filter: FilterUserInput!) {
    user(filter: $filter) {
      _id
      email
      bio
      username
      pseudonym
    }
  }
`;

const UserView = ({ className, _id }) => {
  const currentUser = useCurrentUser();
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
          <div className="flex flex-col gap-sm my-sm md:my-md">
            <div className="flex justify-between items-center">
              <Text variant="pageTitle">{data.user.pseudonym}</Text>
            </div>
            <Text variant="p">{data.user.bio}</Text>
          </div>
          <StoryList filter={{ author: { eq: data.user._id }, root: null }} />
        </>
      }
    </div>
  );
};

export default UserView;

