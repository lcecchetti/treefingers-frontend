import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';
import ForestCard from 'components/forest/ForestCard';
import { InfiniteScroll } from 'components/common';
import { Text } from 'components/ui';

/**
 * Forests list query
 * @type {gql}
 */
export const QUERY_FORESTS = gql`
  query forests($filter: FilterForestInput, $sort: SortForestInput, $first: Int, $after: String) {
    forests(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          _id
          name
          excerpt
          commentsCount
          membersCount
          currentUserMembership {
            _id
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        totalCount
      }
    }
  }
`;

const ForestList = ({ className, filter, sort, first = 10, setTotalCount }) => {
  const currentUser = useCurrentUser();
  const { data, loading, error, refetch, fetchMore } = useQuery(QUERY_FORESTS, { variables: { filter, first, sort } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);


  useEffect(() => {
    setTotalCount && setTotalCount(data?.forests.pageInfo.totalCount);
  }, [data?.forests.pageInfo.totalCount]);

  return (!!data?.forests.edges.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => fetchMore({ variables: { after: data?.forests.pageInfo.endCursor }, ...opt })} loading={loading} error={error} hasMore={data?.forests.pageInfo.hasNextPage}>
      {data.forests.edges.map(({ node }) => (
        <ForestCard key={node._id} forest={node} />
      ))}
    </InfiniteScroll>
  );
};

export default ForestList;

