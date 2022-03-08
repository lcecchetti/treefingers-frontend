import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { InfiniteScroll } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { Avatar } from 'components/user';

/**
 * Users list query
 * @type {gql}
 */
export const QUERY_USERS = gql`
  query users($filter: FilterUserInput, $first: Int, $after: String) {
    users (filter: $filter, first: $first, after: $after) {
      edges {
        node {
          _id
          username
          pseudonym
          likesCount
        }
      }
      pageInfo {
        startCursor
        hasNextPage
      }
    }
  }
`;

const UserList = ({ className, filter, first = 10 }) => {
  const currentUser = useCurrentUser();
  const { data, loading, error, refetch, fetchMore } = useQuery(QUERY_USERS, { variables: { filter, first } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  return (
    <InfiniteScroll className={clsx('grid md:grid-cols-4 gap-md', className)} onLoadMore={() => fetchMore({ variables: { after: data?.users.pageInfo.endCursor } })} loading={loading} error={error} hasMore={data?.users.pageInfo.hasNextPage}>
      {data?.users && data.users.edges.map(({ node }) => (
        <Avatar key={node._id} user={node} showName={true} />
      ))}
    </InfiniteScroll>
  );
};

export default UserList;

