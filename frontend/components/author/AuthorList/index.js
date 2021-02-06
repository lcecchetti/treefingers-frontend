import { Link, Spinner, Text } from 'components/ui';
import { getAuthorUrl } from 'lib/helper/author';
import { gql, useQuery } from '@apollo/client';

/**
 * Authors list query
 * @type {gql}
 */
//@todo limit to users with at least one story
export const QUERY_AUTHORS = gql`
  query users {
    users {
      id
      username
    }
  }
`;

const AuthorList = ({ titleVariant = 'pageTitle' }) => {
  const { data, loading, error } = useQuery(QUERY_AUTHORS);

  return (
    <div className="">
      <Text variant={titleVariant}>Authors</Text>

      {loading && <Spinner />}

      {error && <Text variant="span" className="text-error">{error}</Text>}

      {data?.users && data.users.map((user) => (
        <div key={user.id} className="">
          <Text variant="h3">
            <Link href={getAuthorUrl(user)} underline={false}>{user.username}</Link>
          </Text>
        </div>
      ))}
    </div>
  );
};

export default AuthorList;

