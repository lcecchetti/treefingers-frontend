import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { InfiniteScroll } from 'components/common';
import StoryCard from 'components/story/StoryCard';
import { useCurrentUser } from 'lib/auth/currentUser';

export const QUERY_STORIES = gql`
  query stories($filter: FilterStoryInput, $sort: SortStoryInput, $first: Int, $after: String) {
    stories(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          excerpt
          createdAt
          depth
          parent {
            id
            likesCount
            descendentsCount
          }
          author {
            id
            username
          }
          tags
          likesCount
          commentsCount
          descendentsCount
          currentUserLike {
            id
          }  
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        totalCount
      }
    }
  }
`;

const StoryList = ({ className, filter, sort, first = 12, setTotalCount }) => {
  const { currentUser } = useCurrentUser();

  const { data, loading, error, fetchMore } = useQuery(QUERY_STORIES, {
    variables: { filter, first, sort },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    setTotalCount && !loading && setTotalCount(data?.stories.pageInfo.totalCount);
  }, [data?.stories.pageInfo.totalCount]);

  return (!!data?.stories.edges.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => fetchMore({ variables: { after: data?.stories.pageInfo.endCursor }, ...opt })} loading={loading} error={error} hasMore={data?.stories.pageInfo.hasNextPage}>
      {data.stories.edges.map(({ node }) => (
        <StoryCard key={node.id} story={node} />
      ))}
    </InfiniteScroll>
  );
};

export default StoryList;

