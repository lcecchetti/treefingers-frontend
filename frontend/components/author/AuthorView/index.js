import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';

/**
 * Author fragment
 * @type {gql}
 */
const FRAGMENT_AUTHOR = gql`
  fragment AuthorFields on UsersPermissionsUser {
    id
    username
    bio
    stories {
      id
      title
      content
      slug
      createdAt
      author {
        id
        username
      }
      tags {
        id
        label
        slug
      }
    }
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

const AuthorView = ({ id, titleVariant = 'pageTitle' }) => {

  const { data, loading, error } = useQuery(QUERY_AUTHOR, { variables: { id } });

  return (
    <div className="">
      {loading && <Spinner />}

      {error && <Text variant="span" className="text-error">{error}</Text>}

      {data &&
        <div className="">
          <Text variant={titleVariant}>{data.user.username}</Text>
          <Text>{data.user.bio}</Text>
          <StoryList queryVariables={{ author: data.user.id }} />
        </div>
      }
    </div>
  );
};

export default AuthorView;

