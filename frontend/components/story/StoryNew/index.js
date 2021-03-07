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
    $action: String,
    $parent: ID,
    $root: ID,
    $tags: [ID]
  ) {
    createStory(input: { data: {
      title: $title,
      content: $content,
      action: $action,
      parent: $parent,
      root: $root,
      tags: $tags,
    }}) {
      story {
        id
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

      if (data?.createStory?.story?.id) {
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
            action: '',
            parent: parent?.id,
            root: parent?.root?.id ?? parent?.id,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Required'),
            content: Yup.string().required('Required'),
            action: Yup.string().when('parent', {
              is: value => value !== undefined,
              then: Yup.string().required('Required'),
            }),
          })}
          onSubmit={(values, methods) => submitStory(values, methods)}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-sm">
              {!!parent &&
                <Field
                  as={FormField}
                  name="action"
                  type="text"
                  label="Action (This will be displayed in the choices list)"
                  error={errors.action}
                  touched={touched.action}
                />
              }
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

