import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useCurrentUser } from 'lib/auth/currentUser';
import { InfiniteScroll } from 'components/common';
import StoryCard from 'components/story/StoryCard';

export const QUERY_STORIES = gql`
  query stories($filter: FilterStoryInput, $sort: SortStoryInput, $first: Int, $after: String) {
    stories(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          _id
          title
          excerpt
          createdAt
          root {
            _id
            likesCount
            descendantsCount
          }
          author {
            _id
            username
          }
          tags
          likesCount
          commentsCount
          descendantsCount
          currentUserLike {
            _id
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

const StoryList = ({ className, filter, sort, first = 10, setTotalCount }) => {
  const { currentUser } = useCurrentUser();

  const { data, loading, error, refetch, fetchMore } = useQuery(QUERY_STORIES, {
    variables: { filter, first, sort },
  });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  useEffect(() => {
    setTotalCount && !loading && setTotalCount(data?.stories.pageInfo.totalCount);
  }, [data?.stories.pageInfo.totalCount]);

  return (!!data?.stories.edges.length &&
    <InfiniteScroll className={className} onLoadMore={(opt) => fetchMore({ variables: { after: data?.stories.pageInfo.endCursor }, ...opt })} loading={loading} error={error} hasMore={data?.stories.pageInfo.hasNextPage}>
      {data.stories.edges.map(({ node }) => (
        <StoryCard key={node._id} story={node} />
      ))}
    </InfiniteScroll>
  );
};

export default StoryList;

