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

/**
 * Create comment mutation
 * @type {gql}
 */
 const MUTATION_COMMENT_FOREST = gql`
 mutation commentForest($input: CommentForestInput!) {
   commentForest(input: $input) {
     comment {
       ...CommentFields
     } 
   }
 }
 ${FRAGMENT_COMMENT_FIELDS}
`;

/**
 * Get entity type
 * @param {Object} entity 
 * @returns {String}
 */
 const getEntityType = (entity) =>  {
  return entity.__typename.toLowerCase();
}

/**
 * Get comment mutation based on entity type
 * @param {string} entityType
 * @returns {String}
 */
 const getCommentMutation = (entityType) =>  {
  switch (entityType) {
    case 'story':
      return MUTATION_COMMENT_STORY;
    case 'forest':  
      return MUTATION_COMMENT_FOREST;
  }
}

/**
 * Get comment mutation name based on entity type
 * @param {string} entityType
 * @returns {String}
 */
 const getCommentMutationName = (entityType) =>  {
  switch (entityType) {
    case 'story':
      return 'commentStory';
    case 'forest':  
      return 'commentForest';
  }
}

const CommentNew = ({ entity }) => {

  // get entity type
  const entityType = getEntityType(entity);

  const input = {};
  input[entityType] = entity._id;

  const [comment, { error }] = useMutation(getCommentMutation(entityType), {
    update(cache, { data }) {

      const filter = {};
      filter[entityType] = { eq: entity._id };

      // add new comment to the cache
      cache.updateQuery({
          query: QUERY_COMMENTS,
          variables: { filter },
        },
        ({ comments }) => ({
          comments: { 
            edges: [
              ...comments.edges,
              { node: data[getCommentMutationName(entityType)].comment },
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
              variables: { input: { ...input, data: values } },
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

