import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { InfiniteScroll } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import UserCard from '../UserCard';

export const QUERY_USERS = gql`
  query users($filter: FilterUserInput, $query: String, $first: Int, $after: String) {
    users (filter: $filter, query: $query, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          excerpt
          username
          followersCount
          currentUserFollowershipAsFollower {
            id
          }
        }
      }
      pageInfo {
        startCursor
        hasNextPage
        totalCount
      }
    }
  }
`;

const UserList = ({ className, filter, sort, first = 10, query, setTotalCount }) => {
  const { currentUser } = useCurrentUser();
  const { data, loading, error, refetch, fetchMore } = useQuery(QUERY_USERS, { variables: { filter, first, sort, query } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  useEffect(() => {
    setTotalCount && !loading && setTotalCount(data?.users.pageInfo.totalCount);
  }, [data?.users.pageInfo.totalCount]);

  return (!!data?.users.edges.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => fetchMore({ variables: { after: data?.users.pageInfo.endCursor }, ...opt })} loading={loading} error={error} hasMore={data?.users.pageInfo.hasNextPage}>
      {data.users.edges.map(({ node }) => (
        <UserCard key={node.id} user={node} />
      ))}
    </InfiniteScroll>
  );
};

export default UserList;

