import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { FormField, Button } from 'components/ui';
import * as Yup from 'yup';
import { AuthRequired } from 'components/auth';
import { QUERY_COMMENTS } from 'components/comment/CommentList';
import { ApiError } from 'components/common';
import * as gtag from 'lib/gtag';
import { useState } from 'react';

const MUTATION_COMMENT = gql`
  mutation submitComment($input: CommentInput!) {
    submitComment(input: $input) {
      comment {
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
        entity {
          id
          commentsCount
        }
      } 
    }
  }
`;

const CommentNew = ({ entity, sort, last }) => {
  const [error, setError] = useState();
  const [comment] = useMutation(MUTATION_COMMENT, {
    update(cache, { data }) {
      // add new comment to the cache
      cache.updateQuery({
          query: QUERY_COMMENTS,
          variables: { filter: { entityId: { eq: entity.id }, entityType: { eq: entity.__typename } }, sort, last },
        },
        ({ comments }) => ({
          comments: { 
            edges: [
              ...comments.edges,
              { node: data.submitComment.comment, cursor: null },
            ],
            pageInfo: comments.pageInfo,
          }
        })
      );
    }, 
    onError(e) {
      gtag.event({
        action: `submit-comment-${entity.__typename}`,
        category: 'comment',
        label: 'error',
      });
      setError(e);
    }
  });

  return (
    <div>
      <AuthRequired>
        <Formik
          enableReinitialize
          initialValues={{
            content: '',
            entityId: entity.id,
            entityType: entity.__typename,
          }}
          validationSchema={Yup.object().shape({
            content: Yup.string().max(512, 'Too long!').required(true),
          })}
          onSubmit={({ content, entityId, entityType }, { resetForm }) => {
            comment({
              variables: { input: { data: { content, entityId, entityType} } },
              onCompleted: () => {
                gtag.event({
                  action: `submit-comment-${entityType}`,
                  category: 'comment',
                  label: 'success'
                });
                resetForm();
              },
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

