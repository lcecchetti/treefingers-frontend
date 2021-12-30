import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { parseError } from 'lib/apollo/error';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { FormField, Button, Text } from 'components/ui';
import * as Yup from 'yup';
import { getStoryUrl } from 'lib/helper';
import { AuthRequired } from 'components/auth';

/**
 * Create story mutation
 * @type {gql}
 */
const MUTATION_STORY_CREATE = gql`
  mutation createStory(
    $title: String!,
    $content: String!,
    $parent: ID,
    $root: ID,
    $tags: [ID]
  ) {
    createStory(input: { data: {
      title: $title,
      content: $content,
      parent: $parent,
      root: $root,
      tags: $tags,
    }}) {
      story {
        _id
      } 
    }
  }
`;

const StoryNew = ({ parent }) => {
  const [createStory] = useMutation(MUTATION_STORY_CREATE);
  const router = useRouter();
  const [createStoryError, setCreateStoryError] = useState('');

  const submitStory = async (values, { resetForm }) => {
    try {
      setCreateStoryError('');

      const { data } = await createStory({
        variables: {
          ...values,
        },
      });

      if (data?.createStory?.story?._id) {
        resetForm();
        router.push(getStoryUrl(data.createStory.story));
      }

    } catch (e) {
      setCreateStoryError(parseError(e));
    }
  };

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
          onSubmit={(values, methods) => submitStory(values, methods)}
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

              {!!createStoryError &&
                <Text variant="error">{createStoryError}</Text>
              }
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

