import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { FormField, Button, Text } from 'components/ui';
import * as Yup from 'yup';
import { getStoryUrl } from 'lib/helper';
import { AuthRequired } from 'components/auth';
import { ApiError } from 'components/common';

/**
 * Create story mutation
 * @type {gql}
 */
const MUTATION_STORY_CREATE = gql`
  mutation createStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      story {
        _id
      } 
    }
  }
`;

const StoryNew = ({ parent }) => {
  const [createStory, { error }] = useMutation(MUTATION_STORY_CREATE, {
    onError: (e) => {},
  });
  const router = useRouter();

  return (
    <div>
      <AuthRequired>
        <Formik
          initialValues={{
            title: '',
            content: '',
            parent: parent?._id,
            root: parent?.root?._id ?? parent?._id,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Required'),
            content: Yup.string().required('Required'),
          })}
          onSubmit={(values, { resetForm }) => createStory({
            variables: { input: { data: values } },
            onCompleted: (data) => {
              resetForm();
              router.push(getStoryUrl(data.createStory.story));
            },
          })}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-sm">
              <Field
                as={FormField}
                name="title"
                type="text"
                label="Title"
                error={errors.title}
                touched={touched.title}
              />
              <Field
                as={FormField}
                name="content"
                type="textarea"
                label="Content"
                rows="10"
                error={errors.content}
                touched={touched.content}
              />
              <ApiError error={error} />
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full">
                Create
                </Button>
            </Form>
          )}
        </Formik>
      </AuthRequired>
    </div>
  );
};

export default StoryNew;

