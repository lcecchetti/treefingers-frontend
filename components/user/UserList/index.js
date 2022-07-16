import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { InfiniteScroll } from 'components/common';
import UserCard from '../UserCard';
import { useCurrentUser } from 'lib/auth/currentUser';

export const QUERY_USERS = gql`
  query users($filter: FilterUserInput, $sort: SortUserInput, $first: Int, $after: String) {
    users (filter: $filter, sort: $sort, first: $first, after: $after) {
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

const UserList = ({ className, filter, sort, first = 10, setTotalCount }) => {
  const { currentUser } = useCurrentUser();

  const { data, loading, error, fetchMore } = useQuery(QUERY_USERS, { 
    variables: { filter, first, sort },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

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

