'use client';

import { Suspense, useTransition } from 'react';
import { Text, Spinner } from '@/components/ui';
import { formatDate } from '@/lib/helper/date';
import { InfiniteScroll, Like } from '@/components/common';
import { Avatar } from '@/components/user';
import { useSuspenseQuery } from '@apollo/client/react';
import { graphql } from '@/lib/graphql/generated';
import { CommentNew } from '@/components/comment/comment-new';
import type { CommentsQueryVariables } from '@/lib/graphql/generated/graphql';

export const QUERY_COMMENTS = graphql(`
  query comments($filter: FilterCommentInput, $sort: SortCommentInput, $last: Int, $before: String) {
    comments(filter: $filter, sort: $sort, last: $last, before: $before) {
      edges {
        cursor
        node {
          __typename
          id
          content
          createdAt
          likesCount
          currentUserLike {
            id
          }
          user {
            id
            username
          }
          story {
            id
            commentsCount
          }
          forest {
            id
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
`);

export interface CommentableEntity {
  __typename: 'Story' | 'Forest';
  id: string;
}

export const getCommentsFilter = (entity: CommentableEntity): CommentsQueryVariables['filter'] =>
  entity.__typename === 'Story' ? { story: { eq: entity.id } } : { forest: { eq: entity.id } };

interface CommentListProps {
  entity: CommentableEntity;
  sort?: CommentsQueryVariables['sort'];
  last?: number;
}

const CommentListContent = ({ entity, sort = { id: 'ASC' as const }, last = 10 }: CommentListProps) => {
  const [isPending, startTransition] = useTransition();
  const { data, error, fetchMore } = useSuspenseQuery(QUERY_COMMENTS, { variables: { filter: getCommentsFilter(entity), sort, last }, errorPolicy: 'all' });

  return (
    <InfiniteScroll className="flex flex-col p-md" error={error ?? false} onLoadMore={(opt) => startTransition(() => { fetchMore({ variables: { before: data?.comments.pageInfo.startCursor }, ...opt }); })} loading={isPending} hasMore={data?.comments.pageInfo.hasPreviousPage} backwards={true}>
      {data &&
        <div className="flex flex-col gap-md">
          {!data?.comments.edges?.length &&
            <Text variant="span">This {entity.__typename.toLowerCase()} has no comments yet.</Text>
          }

          {!!data?.comments.edges?.length &&
            <ol className="flex flex-col gap-sm">
              {data.comments.edges.map(({ node }) => (
                <li key={node.id}>
                  <div className="flex flex-col gap-xs">
                    <Avatar className={undefined} user={node.user} showName={true} />
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

export const CommentList = (props: CommentListProps) => (
  <Suspense fallback={<Spinner className="my-lg" />}>
    <CommentListContent {...props} />
  </Suspense>
);
