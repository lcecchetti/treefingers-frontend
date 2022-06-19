import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import ForestCard from 'components/forest/ForestCard';
import { InfiniteScroll } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';

export const QUERY_FORESTS = gql`
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
`;

const ForestList = ({ className, filter, sort, first = 10, setTotalCount }) => {
  const { currentUser } = useCurrentUser();

  const { data, loading, error, fetchMore } = useQuery(QUERY_FORESTS, { 
    variables: { filter, first, sort }, 
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });
  
  useEffect(() => {
    setTotalCount && !loading && setTotalCount(data?.forests.pageInfo.totalCount);
  }, [data?.forests.pageInfo.totalCount]);

  return (!!data?.forests.edges.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => fetchMore({ variables: { after: data?.forests.pageInfo.endCursor }, ...opt })} loading={loading} error={error} hasMore={data?.forests.pageInfo.hasNextPage}>
      {data.forests.edges.map(({ node }) => (
        <ForestCard key={node.id} forest={node} />
      ))}
    </InfiniteScroll>
  );
};

export default ForestList;

