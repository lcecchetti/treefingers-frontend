import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';

/**
 * Single author query
 * @type {gql}
 */
export const QUERY_AUTHOR = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      username
    }
  }
`;

/**
 * Get authors by username query
 * @type {gql}
 */
export const QUERY_AUTHORS_BY_USERNAME = gql`
  query users($username: String!) {
    users(where: { username: $username }) {
      id
      username
    }
  }
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
        </div>
      }
    </div>
  );
};

export default AuthorView;

