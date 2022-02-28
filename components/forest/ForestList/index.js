import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';
import { ForestCard, FRAGMENT_FOREST_CARD_FIELDS } from 'components/forest';
import { InfiniteScroll } from 'components/common';

/**
 * Forests list query
 * @type {gql}
 */
export const QUERY_FORESTS = gql`
  query forests($filter: FilterForestInput, $first: Int, $last: Int, $after: String, $before: String) {
    forests(filter: $filter, first: $first, last: $last, before: $before, after: $after) {
      edges {
        node {
          ...ForestCardFields
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${FRAGMENT_FOREST_CARD_FIELDS}
`;

const ForestList = ({ className, filter, first = 10 }) => {
  const currentUser = useCurrentUser();
  const { data, loading, error, refetch, fetchMore } = useQuery(QUERY_FORESTS, { variables: { filter, first } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  return (
    <InfiniteScroll className={clsx('grid xl:grid-cols-3 sm:grid-cols-2 gap-md', className)} onLoadMore={() => fetchMore({ variables: { after: data?.forests.pageInfo.endCursor } })} loading={loading} error={error} hasMore={data?.forests.pageInfo.hasNextPage}>
      {data?.forests && data.forests.edges.map(({ node }) => (
        <ForestCard key={node._id} forest={node} />
      ))}
    </InfiniteScroll>
  );
};

export default ForestList;

