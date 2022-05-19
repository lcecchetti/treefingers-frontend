import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { Formik, Form, Field, FieldArray } from 'formik';
import { FormField, Button, Text } from 'components/ui';
import * as Yup from 'yup';
import { getStoryUrl } from 'lib/helper/story';
import { AuthRequired } from 'components/auth';
import { ApiError } from 'components/common';
import { FaTimes } from 'react-icons/fa';
import * as gtag from 'lib/gtag';
import { useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { flyoutTypes, useUI } from 'lib/ui/context';

const MUTATION_STORY_CREATE = gql`
  mutation createStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      story {
        id
        author {
          id
          storiesCount
        }
      } 
    }
  }
`;

const QUERY_CHOOSE_FOREST = gql`
  query forests($filter: FilterForestInput) {
    forests(filter: $filter, first: 10) {
      edges {
        node {
          id
          name
          storiesCount
        }
      }
    }
  }
`;

const StoryNew = ({ parent, forestId, className }) => {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const { openFlyout } = useUI();
  const [error, setError] = useState(false);
  const [createStory] = useMutation(MUTATION_STORY_CREATE, {
    onError: (e) => {
      gtag.event({
        action: 'create-story',
        category: 'story',
        label: 'error',
      });
      setError(e);
    },
  });

  const hasForestSelection = !parent;

  const { data: forestsData, loading: forestsLoading } = useQuery(QUERY_CHOOSE_FOREST, {
    variables: {
      filter: forestId ? { id: { eq: forestId } } : {},
    },
    skip: !hasForestSelection,
  });

  const prepareForestOptions = (data) => {
    const options = data.forests.edges.map(({ node }) =>({
      value: node.id,
      label: `${node.name} (${node.storiesCount} stories)`,
    }));

    if (!options.length) {
      options.push({
        value: '',
        label: 'No forest found...',
      });
    }

    return options;
  };

  return (
    <div className={className}>
      <AuthRequired>
        <Formik
          enableReinitialize
          initialValues={{
            title: '',
            content: '',
            parentId: parent?.id,
            addTag: '',
            tags: [],
            forestId: forestsData ? prepareForestOptions(forestsData).shift()?.value : '',
            forests: forestsData ? prepareForestOptions(forestsData) : [],
            forestsLoading: forestsLoading,
            hasForestSelection,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().max(64, 'Too long!').required(true),
            content: Yup.string().max(4096, 'Too long!').required(true),
            addTag: Yup.string().max(16, 'Too long'),
            forestId: Yup.string().when('hasForestSelection', {
              is: () => hasForestSelection,
              then: Yup.string().required(true),
            })
          })}
          onSubmit={({ title, content, parentId, tags, forestId }, { setSubmitting }) => createStory({
            variables: { input: { data: {
              title, content, parentId, forestId, tags
            }}},
            onCompleted: (data) => {
              gtag.event({
                action: 'create-story',
                category: 'story',
                label: 'success',
              });
              router.push(getStoryUrl(data.createStory.story));
            },
            onError: () => {
              setSubmitting(false);
            }
          })}
        >
          {({ isSubmitting, values, setFieldValue, errors, touched }) => (
            <Form className="flex flex-col gap-sm">
              <Field
                as={FormField}
                name="title"
                type="text"
                label={!parent ? 'Title' : 'Action'}
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
              <FieldArray
                name="tags"
                render={arrayHelpers => (
                  <div className="flex flex-col gap-sm">
                    <div className="flex gap-sm justify-items-stretch items-center">
                      <Field className="grow" name="addTag" as={FormField} type="text" 
                        label="Tag your story" 
                        error={errors.addTag}
                        touched={errors.addTag}
                        hint="Use meaningful keywords, it'll make it easier to search for it"
                      />
                      <Button className="whitespace-nowrap" disabled={values.tags.length >= 5} type="button" size="md" onClick={() => { 
                        if(values.tags.includes(values.addTag) || !values.addTag) {
                          return;
                        } 
                        arrayHelpers.push(values.addTag.replace(/\s/g,''));
                        setFieldValue('addTag', '');
                      }}>Add Tag</Button>
                    </div>
                    {!!values.tags.length && (
                      <ul className="flex flex-wrap gap-xs">
                        {values.tags.map((tag, index) => (
                          <Button size="sm" key={index}>{tag} <FaTimes onClick={() => arrayHelpers.remove(index)}/></Button>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              />

              {values.hasForestSelection &&
                <div className="flex flex-col gap-sm">
                  <div>
                    <Text variant="p">
                      Select a forest
                    </Text>
                    <Text variant="p" className="text-sm">
                      Forests are places where to group stories. Pick the one that suits your story the most, or create your own by clicking
                      <Text className="cursor-pointer text-primary-light font-bold" onClick={() => openFlyout(flyoutTypes.forestNew, { title: 'Create forest' })}> here</Text> 
                    </Text>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm w-full"> 
                    <Field
                      as={FormField} 
                      name="searchForest"
                      className="grow"
                      placeholder="Search..."
                      type="text" 
                      onChange={async (e) => {
                        setFieldValue('forestsLoading', true);
                        setFieldValue('forestId', '');
                        const { data, error } = await apolloClient.query({
                          query: QUERY_CHOOSE_FOREST,
                          variables: { filter: { query: e.target.value } },
                        });

                        if(error) {
                          setError(error);
                        }

                        if (data) {
                          setFieldValue('forests', prepareForestOptions(data));
                          setFieldValue('forestId', prepareForestOptions(data).shift()?.value);
                        }

                        setFieldValue('forestsLoading', false);
                      }} 
                    />
                    <Field 
                      as={FormField}
                      className={clsx(values.forestsLoading && 'animate-pulse')}
                      name="forestId"
                      type="select"
                      error={errors.forest}
                      disabled={!values.forest}
                      touched={touched.forest}
                      options={values.forests}
                    />
                  </div>
                </div>
              }

              <ApiError error={error} />
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full mt-sm">
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

