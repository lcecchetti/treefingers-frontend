import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { FormField, Button } from 'components/ui';
import * as Yup from 'yup';
import { AuthRequired } from 'components/auth';
import { QUERY_COMMENTS, FRAGMENT_COMMENT_FIELDS } from 'components/comment';
import { ApiError } from 'components/common';

/**
 * Create comment mutation
 * @type {gql}
 */
const MUTATION_COMMENT = gql`
  mutation submitComment($input: CommentInput!) {
    submitComment(input: $input) {
      comment {
        ...CommentFields
      } 
    }
  }
  ${FRAGMENT_COMMENT_FIELDS}
`;

const CommentNew = ({ entity }) => {
  const [comment, { error }] = useMutation(MUTATION_COMMENT, {
    update(cache, { data }) {
      // add new comment to the cache
      cache.updateQuery({
          query: QUERY_COMMENTS,
          variables: { filter: { entity: { eq: entity._id }, entityType: entity.__typename } },
        },
        ({ comments }) => ({
          comments: { 
            edges: [
              ...comments.edges,
              { node: data.submitComment.comment },
            ]
          }
        })
      );
    }, 
    onError(e) {}
  });

  return (
    <div>
      <AuthRequired>
        <Formik
          initialValues={{
            content: '',
          }}
          validationSchema={Yup.object().shape({
            content: Yup.string().required('Required'),
          })}
          onSubmit={(values, { resetForm }) => {
            comment({
              variables: { input: { data: { ...values, entity: entity._id, entityType: entity.__typename } } },
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

