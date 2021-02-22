import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { parseError } from 'lib/apollo/error';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { FormField, Button, Text, Spinner, Link } from 'components/ui';
import * as Yup from 'yup';
import { getLoginUrl, getStoryUrl } from 'lib/helper';

/**
 * Create story mutation
 * @type {gql}
 */
const MUTATION_STORY_NEW = gql`
  mutation createStory(
    $title: String!,
    $content: String!,
    $author: ID,
    $action: String,
    $parent: ID,
    $root: ID,
    $tags: [ID]
  ) {
    createStory(input: { data: {
      title: $title,
      content: $content,
      author: $author,
      action: $action,
      parent: $parent,
      root: $root,
      tags: $tags,
    }}) {
      story {
        id
        root {
          id
        }
      } 
    }
  }
`;

/**
 * Self query
 * @type {gql}
 */
const QUERY_SELF = gql`
  query self {
    self {
      id
      username
    }
  }
`;

const StoryNew = ({ parent }) => {
  const { data, loading, error } = useQuery(QUERY_SELF);
  const [createStory] = useMutation(MUTATION_STORY_NEW);
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (values, methods) => {
    try {
      setApiError('');

      const { data, error } = await createStory({
        variables: {
          ...values,
          author: data.self.id,
          parent: parent?.id,
          root: parent?.root?.id ?? parent?.id,
        },
      });

      if (data?.story?.id) {
        router.push(getStoryUrl(data.story));
      }

      if (error) {
        setApiError(error);
      }
    } catch (e) {
      setApiError(parseError(e).message);
    }
  };

  return (
    <div>
      {loading && <Spinner />}

      {error &&
        <div className="my-md flex flex-col gap-sm items-center p-lg border-t-2 border-b-2">
          <Text variant="p">Hey, it looks like you are not logged in. Login or create an account and you'll be ready to go.</Text>
          <Button as={Link} styleAsLink={false} href={getLoginUrl(router.asPath)}>Login / Register</Button>
        </div>
      }

      {data?.self &&
        <Formik
          initialValues={{
            title: '',
            content: '',
            action: '',
          }}
          onSubmit={(values, methods) => handleSubmit(values, methods)}
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Required'),
            content: Yup.string().required('Required'),
          })}
        >
          {({ isSubmitting }) => (
            <Form>
              {!!parent?.id &&
                <Field
                  as={FormField}
                  name="action"
                  type="text"
                  label="Action (This will be displayed in the choices list)"
                />
              }
              <Field
                as={FormField}
                name="title"
                type="text"
                label="Title"
              />
              <Field
                as={FormField}
                name="content"
                type="textarea"
                label="Content"
              />
              <Field
                as="input"
                name="author"
                type="hidden"
              />
              <Field
                as="input"
                name="parent"
                type="hidden"
              />
              <Field
                as="input"
                name="root"
                type="hidden"
              />

              {!!apiError &&
                <Text variant="error">{apiError}</Text>
              }
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="my-md w-full">
                Create
                </Button>
            </Form>
          )}
        </Formik>
      }
    </div>
  );
};

export default StoryNew;

