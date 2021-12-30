import { useEffect } from 'react';
import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import { Like } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';

/**
 * Author fragment
 * @type {gql}
 */
const FRAGMENT_AUTHOR = gql`
  fragment AuthorFields on User {
    _id
    email
    bio
    currentUserLike {
      _id
    }
    likesCount
  }
`;

/**
 * Single author query
 * @type {gql}
 */
export const QUERY_AUTHOR = gql`
  query user($_id: ID!) {
    user (filter: { _id: { eq: $_id } }) {
      ...AuthorFields
    }
  }
  ${FRAGMENT_AUTHOR}
`;

/**
 * Get authors by username query
 * @type {gql}
 */
export const QUERY_AUTHORS_BY_USERNAME = gql`
  query users ($username: String!) {
    users (filter: { username: { eq: $username } }) {
      ...AuthorFields
    }
  }
  ${FRAGMENT_AUTHOR}
`;

const AuthorView = ({ className, _id }) => {

  const user = useUser();
  const { data, loading, error, refetch } = useQuery(QUERY_AUTHOR, { variables: { _id } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (user !== null) {
      refetch();
    }
  }, [user]);

  return (
    <div className={className}>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {data &&
        <>
          <div className="flex flex-col gap-sm my-sm md:my-md">
            <div className="flex justify-between items-center">
              <Text variant="pageTitle">{data.user.username}</Text>
              <Like entity={data.user} />
            </div>
            <Text variant="p">{data.user.bio}</Text>
          </div>
          <StoryList author={data.user} rootsOnly={false} />
        </>
      }
    </div>
  );
};

export default AuthorView;

