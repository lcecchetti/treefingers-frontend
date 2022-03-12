import { Text, Spinner } from 'components/ui';
import { formatDate } from 'lib/helper/date';
import { ApiError, InfiniteScroll, Like } from 'components/common';
import { Avatar } from 'components/user';
import { gql, useQuery } from '@apollo/client';
import { CommentNew } from 'components/comment';

/**
 * Comment fields
 * @type gql
 */
 export const FRAGMENT_COMMENT_FIELDS = gql`
  fragment CommentFields on Comment {
    _id
    content
    createdAt
    likesCount
    currentUserLike {
      _id
    }
    user {
      _id
      username
    }
    entity {
      _id
      commentsCount
    }
  }
`;

/**
 * Comments list query
 * @type {gql}
 */
export const QUERY_COMMENTS = gql`
  query comments($filter: FilterCommentInput, $sort: SortInput, $last: Int, $before: String) {
    comments(filter: $filter, sort: $sort, last: $last, before: $before) {
      edges {
        cursor
        node {
          ...CommentFields
        }
      }
      pageInfo {
        startCursor
        hasPreviousPage
      }
    }
  }
  ${FRAGMENT_COMMENT_FIELDS}
`;

const CommentList = ({ entity, last = 10 }) => {
  const { data, loading, error, fetchMore } = useQuery(QUERY_COMMENTS, { variables: { filter: { entity: { eq: entity._id }, entityType: entity.__typename }, sort: { _id: 'ASC' }, last } });

  return (
    <InfiniteScroll className="h-full flex flex-col gap-md px-md" error={error} onLoadMore={() => fetchMore({ variables: { before: data?.comments.pageInfo.startCursor } })} loading={loading} hasMore={data?.comments.pageInfo.hasPreviousPage} backwards={true}>
      {data &&
        <div className="flex flex-col gap-md">
          {!data?.comments.edges.length &&
            <Text variant="span">This {entity.__typename.toLowerCase()} has no comments yet.</Text>
          }

          {!!data?.comments.edges.length &&
            <ol className="flex flex-col gap-sm">
              {data.comments.edges.map(({ node }) => (
                <li key={node._id}>
                  <div className="flex flex-col gap-xs">
                    <Avatar user={node.user} showName={true} />
                    <Text variant="span">{node.content}</Text>
                    <div className="flex justify-between items-center">
                      <Text variant="span" className="text-sm">{formatDate(node.createdAt)}</Text>
                      <Like entity={node} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          }

          <CommentNew entity={entity} />
        </div>
      }
    </InfiniteScroll>
  );
}

export default CommentList;