import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { InfiniteScroll } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import UserCard from '../UserCard';

export const QUERY_USERS = gql`
  query users($filter: FilterUserInput, $first: Int, $after: String) {
    users (filter: $filter, first: $first, after: $after) {
      edges {
        cursor
        node {
          _id
          excerpt
          username
          followersCount
          currentUserFollowership {
            _id
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
  const { data, loading, error, refetch, fetchMore } = useQuery(QUERY_USERS, { variables: { filter, first, sort } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  useEffect(() => {
    setTotalCount && setTotalCount(data?.users.pageInfo.totalCount);
  }, [data?.users.pageInfo.totalCount]);

  return (
    <>
      {!!data?.users.edges.length &&
        <InfiniteScroll className={className} onLoadMore={(opt) => fetchMore({ variables: { after: data?.users.pageInfo.endCursor }, ...opt })} loading={loading} error={error} hasMore={data?.users.pageInfo.hasNextPage}>
          {data.users.edges.map(({ node }) => (
            <UserCard key={node._id} user={node} />
          ))}
        </InfiniteScroll>
      }
    </>
  );
};

export default UserList;

