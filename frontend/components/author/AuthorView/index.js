import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList, FRAGMENT_STORIES_STORY } from 'components/story';

/**
 * Author fragment
 */
//@todo make story list as fragment and write cache manually on page load
const FRAGMENT_AUTHOR = gql`
  fragment AuthorFields on UsersPermissionsUser {
    id
    username
    stories {
      ...StoryFields
    }
  }
  ${FRAGMENT_STORIES_STORY}
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
          <StoryList variables={{ author: data.user.id }} />
        </div>
      }
    </div>
  );
};

export default AuthorView;

