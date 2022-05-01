import { Text } from 'components/ui';
import { formatDate } from 'lib/helper/date';
import { InfiniteScroll, Like } from 'components/common';
import { Avatar } from 'components/user';
import { gql, useQuery } from '@apollo/client';
import CommentNew from 'components/comment/CommentNew';

/**
 * Comments list query
 * @type {gql}
 */
export const QUERY_COMMENTS = gql`
  query comments($filter: FilterCommentInput, $sort: SortCommentInput, $last: Int, $before: String) {
    comments(filter: $filter, sort: $sort, last: $last, before: $before) {
      edges {
        cursor
        node {
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
      }
      pageInfo {
        startCursor
        hasPreviousPage
      }
    }
  }
`;

const CommentList = ({ entity, sort = { _id: 'ASC' }, last = 10 }) => {
  const { data, loading, error, fetchMore } = useQuery(QUERY_COMMENTS, { variables: { filter: { entity: { eq: entity._id }, entityType: entity.__typename }, sort, last } });

  return (
    <InfiniteScroll className="flex flex-col p-md" error={error} onLoadMore={(opt) => fetchMore({ variables: { before: data?.comments.pageInfo.startCursor }, ...opt })} loading={loading} hasMore={data?.comments.pageInfo.hasPreviousPage} backwards={true}>
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
                    <Text variant="span" className="whitespace-pre-wrap">{node.content}</Text>
                    <div className="flex justify-between items-center">
                      <Text variant="span" className="text-sm">{formatDate(node.createdAt)}</Text>
                      <Like entity={node} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          }

          <CommentNew entity={entity} sort={sort} last={last} />
        </div>
      }
    </InfiniteScroll>
  );
}

export default CommentList;