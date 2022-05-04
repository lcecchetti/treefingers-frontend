import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { FormField, Button } from 'components/ui';
import * as Yup from 'yup';
import { AuthRequired } from 'components/auth';
import { QUERY_COMMENTS } from 'components/comment/CommentList';
import { ApiError } from 'components/common';
import * as gtag from 'lib/gtag';

/**
 * Create comment mutation
 * @type {gql}
 */
const MUTATION_COMMENT = gql`
  mutation submitComment($input: CommentInput!) {
    submitComment(input: $input) {
      comment {
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
  }
`;

const CommentNew = ({ entity, sort, last }) => {
  const [comment, { error }] = useMutation(MUTATION_COMMENT, {
    update(cache, { data }) {
      // add new comment to the cache
      cache.updateQuery({
          query: QUERY_COMMENTS,
          variables: { filter: { entity: { eq: entity._id }, entityType: entity.__typename }, sort, last },
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
    }
  });

  return (
    <div>
      <AuthRequired>
        <Formik
          initialValues={{
            content: '',
          }}
          validationSchema={Yup.object().shape({
            content: Yup.string().required(true),
          })}
          onSubmit={(values, { resetForm }) => {
            comment({
              variables: { input: { data: { ...values, entity: entity._id, entityType: entity.__typename } } },
              onCompleted: () => {
                gtag.event({
                  action: `submit-comment-${entity.__typename}`,
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

