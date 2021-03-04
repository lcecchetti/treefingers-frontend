import { useEffect } from 'react';
import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import { Like } from 'components/common';
import { useUser } from 'lib/auth';

/**
 * Author fragment
 * @type {gql}
 */
const FRAGMENT_AUTHOR = gql`
  fragment AuthorFields on UsersPermissionsUser {
    id
    username
    bio
    currentUserLike {
      id
    }
    likesCount
  }
`;

/**
 * Single author query
 * @type {gql}
 */
export const QUERY_AUTHOR = gql`
  query user ($id: ID!) {
    user (id: $id) {
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
    users (where: { username: $username }) {
      ...AuthorFields
    }
  }
  ${FRAGMENT_AUTHOR}
`;

const AuthorView = ({ className, id }) => {

  const user = useUser();
  const { data, loading, error, refetch } = useQuery(QUERY_AUTHOR, { variables: { id } });

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
          <Like className="justify-end" author={data.user} currentUserLike={data.user.currentUserLike} count={data.user.likesCount} />
          <StoryList author={data.user} rootsOnly={false} />
        </>
      }
    </div>
  );
};

export default AuthorView;

