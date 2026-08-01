import { useMutation, type ApolloError } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { Formik, Form, Field } from 'formik';
import { FormField, Button } from 'components/ui';
import * as Yup from 'yup';
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

  return (
    <div>
      <AuthRequired>
        <Formik<CommentFormValues>
          enableReinitialize
          initialValues={{
            content: '',
          }}
          validationSchema={Yup.object().shape({
            content: Yup.string().max(512, 'Too long!').required(),
          })}
          onSubmit={({ content }, { resetForm, setSubmitting }) => {
            comment({
              variables: { input: { data: { content, ...(entity.__typename === 'Story' ? { story: entity.id } : { forest: entity.id }) } } },
              onCompleted: () => {
                resetForm();
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
                setSubmitting(false);
              }
            });
          }}>
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-sm">
              <Field
                as={FormField}
                name="content"
                type="textarea"
                rows="2"
                placeholder="Your comment..."
                error={errors.content}
                touched={touched.content}
              />
              <ApiError error={error} />
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full">
                Comment
                </Button>
            </Form>
          )}
        </Formik>
      </AuthRequired>
    </div>
  );
};

export default CommentNew;
