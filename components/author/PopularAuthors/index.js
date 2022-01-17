import { Spinner } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { ApiError } from 'components/common';
import { Avatar } from 'components/user';
import { Text } from 'components/ui';

/**
 * Authors list query
 * @type {gql}
 */
export const QUERY_AUTHORS_POPULAR = gql`
  query users {
    users (sort: { likesCount: DESC }, pagination: { pageSize: 5 }) {
      edges {
        node {
          _id
          username
          pseudonym
        }
      }
    }
  }
`;

const PopularAuthors = ({ className }) => {
  const { data, loading, error } = useQuery(QUERY_AUTHORS_POPULAR);

  return (
    <div className={clsx('flex flex-col gap-sm', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      <Text variant="pageSubtitle" as="h2">Popular authors</Text>

      {data?.users && data.users.edges.map(({ node }) => (
        <Avatar key={node._id} user={node} showName={true} />
      ))}
    </div>
  );
};

export default PopularAuthors;

