import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { InfiniteScroll } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { Text } from 'components/ui';
import AuthorCard from '../AuthorCard';

/**
 * Authors list query
 * @type {gql}
 */
export const QUERY_AUTHORS = gql`
  query users($first: Int, $after: String) {
    users (filter: { storiesCount: { gt: 0 } }, first: $first, after: $after) {
      edges {
        cursor
        node {
          _id
          username
          followersCount
          currentUserFollowership {
            _id
          }
          stories (filter: { root: null }, sort: { likesCount: DESC }, first: 5){
            edges {
              node {
                _id
                title
              }
            }
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

const AuthorList = ({ className, sort, first = 10 }) => {
  const currentUser = useCurrentUser();
  const { data, loading, error, refetch, fetchMore } = useQuery(QUERY_AUTHORS, { variables: { first, sort } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  return (
    <>
      {!data?.users.edges.length &&
        <Text>No results.</Text>
      }

      {!!data?.users.edges.length &&
        <InfiniteScroll className={clsx('grid xl:grid-cols-3 md:grid-cols-2 gap-md', className)} onLoadMore={(opt) => fetchMore({ variables: { after: data?.users.pageInfo.endCursor }, ...opt })} loading={loading} error={error} hasMore={data?.users.pageInfo.hasNextPage}>
          {data.users.edges.map(({ node }) => (
            <AuthorCard key={node._id} author={node} />
          ))}
        </InfiniteScroll>
      }
    </>
  );
};

export default AuthorList;

