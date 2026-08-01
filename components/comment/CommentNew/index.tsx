import { useMutation, type ApolloError } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { Controller, useForm } from 'react-hook-form';
import { FormField, Button } from 'components/ui';
import { AuthRequired } from 'components/auth';
import { QUERY_COMMENTS, getCommentsFilter, type CommentableEntity } from 'components/comment/CommentList';
import { ApiError } from 'components/common';
import * as gtag from 'lib/gtag';
import { useState } from 'react';
import type { CommentsQueryVariables } from 'lib/graphql/generated/graphql';

const MUTATION_COMMENT = graphql(`
  mutation submitComment($input: CommentInput!) {
    submitComment(input: $input) {
      comment {
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
  }
`);

interface CommentNewProps {
  entity: CommentableEntity;
  sort: CommentsQueryVariables['sort'];
  last: number;
}

interface CommentFormValues {
  content: string;
}

const CommentNew = ({ entity, sort, last }: CommentNewProps) => {
  const [error, setError] = useState<ApolloError | false>(false);
  const [comment] = useMutation(MUTATION_COMMENT, {
    update(cache, { data }) {
      if (!data) return;
      // add new comment to the cache
      cache.updateQuery({
          query: QUERY_COMMENTS,
          variables: { filter: getCommentsFilter(entity), sort, last },
        },
        (existing) => existing && ({
          comments: {
            edges: [
              ...(existing.comments.edges ?? []),
              // no real cursor yet for an optimistic, client-only edge; pageInfo (below) is untouched, so this is never read
              { node: data.submitComment.comment, cursor: null as unknown as string },
            ],
            pageInfo: existing.comments.pageInfo,
          }
        })
      );
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm<CommentFormValues>({
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = ({ content }: CommentFormValues) =>
    comment({
      variables: { input: { data: { content, ...(entity.__typename === 'Story' ? { story: entity.id } : { forest: entity.id }) } } },
      onCompleted: () => {
        reset();
        gtag.event({
          action: `submit-comment-${entity.__typename.toLowerCase()}`,
          category: 'comment',
          label: 'success'
        });
        setError(false);
      },
      onError: (e) => {
        gtag.event({
          action: `submit-comment-${entity.__typename.toLowerCase()}`,
          category: 'comment',
          label: 'error',
        });
        setError(e);
      }
    });

  return (
    <div>
      <AuthRequired>
        <form noValidate className="flex flex-col gap-sm" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="content"
            control={control}
            rules={{ required: 'Required', maxLength: { value: 512, message: 'Too long!' } }}
            render={({ field: { ref, ...field } }) => (
              <FormField
                {...field}
                type="textarea"
                rows={2}
                placeholder="Your comment..."
                error={errors.content?.message}
                touched={touchedFields.content}
              />
            )}
          />
          <ApiError error={error} />
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="w-full">
            Comment
            </Button>
        </form>
      </AuthRequired>
    </div>
  );
};

export default CommentNew;
