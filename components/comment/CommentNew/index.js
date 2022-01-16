import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { FormField, Button } from 'components/ui';
import * as Yup from 'yup';
import { AuthRequired } from 'components/auth';
import { QUERY_COMMENTS, FRAGMENT_COMMENT_FIELDS } from '../CommentList';
import { ApiError } from 'components/common';

/**
 * Create comment mutation
 * @type {gql}
 */
const MUTATION_COMMENT_STORY = gql`
  mutation commentStory($input: CommentStoryInput!) {
    commentStory(input: $input) {
      comment {
        ...CommentFields
      } 
    }
  }
  ${FRAGMENT_COMMENT_FIELDS}
`;

const CommentNew = ({ story }) => {
  const [commentStory, { error }] = useMutation(MUTATION_COMMENT_STORY, {
    update(cache, { data }) {

      // add new comment to the cache
      cache.updateQuery({
          query: QUERY_COMMENTS,
          variables: { filter: { story: { eq: story._id } } },
        },
        ({ comments }) => ({
          comments: { 
            edges: [
              ...comments.edges,
              { node: data.commentStory.comment },
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
            commentStory({
              variables: { input: { story: story._id, data: values } },
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

