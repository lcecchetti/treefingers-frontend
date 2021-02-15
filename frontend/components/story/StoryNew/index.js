import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { parseError } from 'lib/apollo/error';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { FormField, Button, Text, Spinner, Link } from 'components/ui';
import * as Yup from 'yup';
import { getStoryUrl } from 'lib/helper/story';
import { getLoginUrl } from 'lib/helper/auth';

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
        slug
        parent {
          id
          slug
        }
        root {
          id
          slug
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

const StoryNew = ({ parent, root }) => {
  const { data: selfData, loading: selfLoading } = useQuery(QUERY_SELF);
  const [createStory] = useMutation(MUTATION_STORY_NEW);
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (values, methods) => {
    try {
      const { data } = await createStory({
        variables: {
          ...values
        },
      });

      if (data?.story?.id) {
        setApiError('');
        router.push(getStoryUrl(data.story));
      }
    } catch (e) {
      setApiError(parseError(e).message);
    }
  };

  return (
    <div>
      <div>
        {selfLoading && <Spinner />}

        {selfData?.self &&
          <Formik
            initialValues={{
              title: '',
              content: '',
              author: selfData.self.id,
              parent: parent?.id,
              root: root?.id,
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
                    label="Action - It'll be listed in the choices at the end of the story"
                  />
                }
                <Field
                  as={FormField}
                  name="title"
                  type="text"
                  label="Title - Your chapter title"
                />
                <Field
                  as={FormField}
                  name="content"
                  type="textarea"
                  label="Content - Your chapter content"
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

      {
        !selfLoading && !selfData &&
        <div className="mt-sm">
          <Text variant="p">Hey, it looks like you are not logged in. Login or create an account and you'll be ready to go.</Text>
          <Button as={Link} styleAsLink={false} href={getLoginUrl()}>Login / Register</Button>
        </div>
      }

    </div>
  );
};

export default StoryNew;

