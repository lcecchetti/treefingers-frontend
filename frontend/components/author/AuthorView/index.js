import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import { PageIntro } from 'components/common';

/**
 * Author fragment
 * @type {gql}
 */
const FRAGMENT_AUTHOR = gql`
  fragment AuthorFields on UsersPermissionsUser {
    id
    username
    bio
  }
`;

/**
 * Single author query
 * @type {gql}
 */
export const QUERY_AUTHOR = gql`
  query user($id: ID!) {
    user(id: $id) {
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
  query users($username: String!) {
    users(where: { username: $username }) {
      ...AuthorFields
    }
  }
  ${FRAGMENT_AUTHOR}
`;

const AuthorView = ({ className, id }) => {

  const { data, loading, error } = useQuery(QUERY_AUTHOR, { variables: { id } });

  return (
    <div>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {data &&
        <>
          <PageIntro title={data.user.username}>
            <Text variant="p">{data.user.bio}</Text>
          </PageIntro>
          <StoryList author={data.user} rootsOnly={false} />
        </>
      }
    </div>
  );
};

export default AuthorView;

