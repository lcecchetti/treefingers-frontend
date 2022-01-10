import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { FormField, Button, Text } from 'components/ui';
import * as Yup from 'yup';
import { AuthRequired } from 'components/auth';
import { QUERY_COMMENTS } from '../CommentList';
import { ApiError } from 'components/common';

/**
 * Create comment mutation
 * @type {gql}
 */
const MUTATION_COMMENT_CREATE = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      comment {
        _id
        content
        createdAt
        user {
          _id
          username
        }
        story {
          _id
          commentsCount
        }
      } 
    }
  }
`;

const CommentNew = ({ story }) => {
  const [createComment, { error }] = useMutation(MUTATION_COMMENT_CREATE, {
    update(cache, { data: { createComment } }) {

      // load previous story comments
      const commentsQuery = {
        query: QUERY_COMMENTS,
        variables: { filter: { story: { eq: story?._id } } }
      };
      const commentsData = cache.readQuery(commentsQuery);

      // add new comment to the cache
      cache.writeQuery({
        ...commentsQuery, data: {
          comments: { 
            edges: [
              ...commentsData.comments.edges,
              { node: createComment.comment },
            ]
          }
        }
      });
    }, 
    onError(e) {}
  });

  return (
    <div>
      <AuthRequired>
        <Formik
          initialValues={{
            content: '',
            story: story?._id,
          }}
          validationSchema={Yup.object().shape({
            content: Yup.string().required('Required'),
          })}
          onSubmit={(values, { resetForm }) => {
            createComment({
              variables: { input: { data: values } },
              onCompleted: () => {
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

