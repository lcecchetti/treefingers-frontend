import { useEffect } from 'react';
import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import { ApiError, Like } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';

/**
 * Single author query
 * @type {gql}
 */
export const QUERY_AUTHOR = gql`
  query user($filter: FilterUserInput!) {
    user(filter: $filter) {
      _id
      email
      bio
      username
      pseudonym
      currentUserLike {
        _id
      }
      likesCount
    }
  }
`;

const AuthorView = ({ className, _id }) => {
  const currentUser = useCurrentUser();
  const { data, loading, error, refetch } = useQuery(QUERY_AUTHOR, { variables: { filter: { _id: { eq: _id } } } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser !== null) {
      refetch();
    }
  }, [currentUser]);

  return (
    <div className={className}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {data &&
        <>
          <div className="flex flex-col gap-sm my-sm md:my-md">
            <div className="flex justify-between items-center">
              <Text variant="pageTitle">{data.user.pseudonym}</Text>
              <Like entity={data.user} />
            </div>
            <Text variant="p">{data.user.bio}</Text>
          </div>
          <StoryList filter={{ author: { eq: data.user._id }, root: null }} />
        </>
      }
    </div>
  );
};

export default AuthorView;

