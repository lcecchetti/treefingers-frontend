import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { parseError } from 'lib/apollo/error';
import { Formik, Form, Field } from 'formik';
import { FormField, Button, Text } from 'components/ui';
import * as Yup from 'yup';
import { AuthRequired } from 'components/auth';
import { QUERY_COMMENTS } from '../CommentList';

/**
 * Create comment mutation
 * @type {gql}
 */
const MUTATION_COMMENT_CREATE = gql`
  mutation createComment(
    $content: String!,
    $story: ID!,
  ) {
    createComment(input: { data: {
      content: $content,
      story: $story,
    }}) {
      comment {
        id
        content
        createdAt
        user {
          id
          username
        }
        story {
          id
          commentsCount
        }
      } 
    }
  }
`;

const CommentNew = ({ story }) => {
  const [createComment] = useMutation(MUTATION_COMMENT_CREATE, {
    update(cache, { data: { createComment } }) {

      // load previous story comments
      const commentsQuery = {
        query: QUERY_COMMENTS,
        variables: { story: story?.id }
      };
      const commentsData = cache.readQuery(commentsQuery);

      // add new comment to the cache
      cache.writeQuery({
        ...commentsQuery, data: {
          comments: [
            ...commentsData.comments,
            createComment.comment,
          ]
        }
      });
    }
  });
  const [createCommentError, setCreateCommentError] = useState('');

  const submitComment = async (values, { resetForm }) => {
    try {
      setCreateCommentError('');

      const { data } = await createComment({
        variables: {
          ...values,
        },
      });

      console.log(data);

      if (data.createComment?.comment?.id) {
        resetForm();
      }

    } catch (e) {
      console.log(e);
      setCreateCommentError(parseError(e));
    }
  };

  return (
    <div>
      <AuthRequired>
        <Formik
          initialValues={{
            content: '',
            story: story?.id,
          }}
          validationSchema={Yup.object().shape({
            content: Yup.string().required('Required'),
          })}
          onSubmit={(values, methods) => submitComment(values, methods)}
        >
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

              {!!createCommentError &&
                <Text variant="error">{createCommentError}</Text>
              }
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

