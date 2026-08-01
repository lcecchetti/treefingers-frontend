import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import ForestCard from 'components/forest/ForestCard';
import { InfiniteScroll } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import type { ForestsQueryVariables } from 'lib/graphql/generated/graphql';

export const QUERY_FORESTS = graphql(`
  query forests($filter: FilterForestInput, $sort: SortForestInput, $first: Int, $after: String) {
    forests(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          name
          excerpt
          commentsCount
          membersCount
          currentUserMembership {
            id
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
`);

interface ForestListProps {
  className?: string;
  filter?: ForestsQueryVariables['filter'];
  sort?: ForestsQueryVariables['sort'];
  first?: number;
  setTotalCount?: (totalCount: number | undefined) => void;
}

const ForestList = ({ className, filter, sort, first = 12, setTotalCount }: ForestListProps) => {
  const { currentUser } = useCurrentUser();

  const { data, loading, error, fetchMore } = useQuery(QUERY_FORESTS, {
    variables: { filter, first, sort },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    setTotalCount && !loading && setTotalCount(data?.forests.pageInfo.totalCount);
  }, [data?.forests.pageInfo.totalCount]);

  return (!!data?.forests.edges?.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => fetchMore({ variables: { after: data?.forests.pageInfo.endCursor }, ...opt })} loading={loading} error={error} hasMore={data?.forests.pageInfo.hasNextPage}>
      {data.forests.edges.map(({ node }) => (
        <ForestCard key={node.id} forest={node} />
      ))}
    </InfiniteScroll>
  );
};

export default ForestList;
