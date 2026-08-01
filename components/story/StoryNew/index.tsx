import { useApolloClient, useMutation, useQuery, type ApolloError } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { Formik, Form, Field, FieldArray } from 'formik';
import { FormField, Button, Text } from 'components/ui';
import type { FormFieldOption } from 'components/ui/FormField';
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
import type { ChooseForestQuery, CreateForestMutation } from 'lib/graphql/generated/graphql';

const MUTATION_STORY_CREATE = graphql(`
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
`);

const MUTATION_STORY_EDIT = graphql(`
  mutation editStory($input: EditStoryInput!) {
    editStory(input: $input) {
      story {
        id
        title
        content
        tags
      }
    }
  }
`);

// named chooseForest (rather than reusing the "forests" operation name from ForestList)
// since graphql-codegen requires unique operation names across all documents
const QUERY_CHOOSE_FOREST = graphql(`
  query chooseForest($filter: FilterForestInput) {
    forests(filter: $filter, first: 10, sort: { membersCount: DESC }) {
      edges {
        node {
          id
          name
          storiesCount
        }
      }
    }
  }
`);

interface StoryNewStory {
  id: string;
  title: string;
  content: string;
  tags: string[];
  parent?: { id: string } | null;
}

interface StoryNewProps {
  story?: StoryNewStory;
  parent?: { id: string };
  forest?: string;
  callback?: () => void;
  className?: string;
}

interface StoryNewFormValues {
  story?: StoryNewStory;
  title: string;
  content: string;
  parent?: string;
  addTag: string;
  tags: string[];
  forest: string;
  forests: FormFieldOption[];
  forestsLoading: boolean;
  hasForestSelection: boolean;
  searchForest?: string;
}

const StoryNew = ({ story, parent, forest, callback, className }: StoryNewProps) => {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const { openFlyout, closeFlyout, showToast } = useUI();
  const [error, setError] = useState<ApolloError | false>(false);
  const [createStory] = useMutation(MUTATION_STORY_CREATE);
  const [editStory] = useMutation(MUTATION_STORY_EDIT);

  const isEditing = !!story;
  const hasForestSelection = !parent && !isEditing;

  const { data: forestsData, loading: forestsLoading } = useQuery(QUERY_CHOOSE_FOREST, {
    variables: {
      filter: forest ? { id: { eq: forest } } : {},
    },
    skip: !hasForestSelection,
  });

  const prepareForestOptions = (data: ChooseForestQuery): FormFieldOption[] => {
    const options = data.forests.edges!.map(({ node }) =>({
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
        <Formik<StoryNewFormValues>
          enableReinitialize
          initialValues={{
            story,
            title: story?.title || '',
            content: story?.content || '',
            parent: parent?.id,
            addTag: '',
            tags: story?.tags || [],
            forest: forestsData ? (prepareForestOptions(forestsData).shift()?.value ?? '') as string : '',
            forests: forestsData ? prepareForestOptions(forestsData) : [],
            forestsLoading: forestsLoading,
            hasForestSelection,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().max(64, 'Too long!').required(),
            content: Yup.string().max(4096, 'Too long!').required(),
            addTag: Yup.string().matches(/^[a-zA-Z0-9_]*$/, 'Tag must not contain special chars or spaces!').max(16, 'Too long'),
            forest: Yup.string().when('hasForestSelection', {
              is: () => hasForestSelection,
              then: Yup.string().required(),
            })
          })}
          onSubmit={({ title, content, parent, tags, forest, story }, { setSubmitting, resetForm }) => {
            if (isEditing) {
              editStory({
                variables: { input: {
                  id: story!.id,
                  data: {
                    title, content, tags
                  },
                }},
                onCompleted: () => {
                  gtag.event({
                    action: 'edit-story',
                    category: 'story',
                    label: 'success',
                  });

                  resetForm();
                  setError(false);
                  showToast(`Your ${story!.parent ? 'chapter' : 'story'} has been updated!`);
                  if (callback) {
                    callback();
                  }
                },
                onError: (e) => {
                  gtag.event({
                    action: 'edit-story',
                    category: 'story',
                    label: 'error',
                  });
                  setError(e);
                  setSubmitting(false);
                }
              })
            } else {
              createStory({
                variables: { input: { data: {
                  title, content, parent, forest, tags
                }}},
                onCompleted: (data) => {
                  gtag.event({
                    action: 'create-story',
                    category: 'story',
                    label: 'success',
                  });

                  resetForm();
                  if (parent) {
                    showToast('Chapter created!');
                  } else {
                    showToast('Story planted!');
                  }
                  setError(false);
                  router.push(getStoryUrl(data.createStory.story));
                },
                onError: (e) => {
                  gtag.event({
                    action: 'create-story',
                    category: 'story',
                    label: 'error',
                  });
                  setError(e);
                  setSubmitting(false);
                }
              })
            }
          }}
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
                hint={parent ? 'This will appear as the action to choose from on the parent chapter' : ''}
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
                    <div className="flex gap-sm justify-items-stretch items-end">
                      <Field className="grow"
                        name="addTag"
                        as={FormField}
                        type="text"
                        label="Tag your story"
                        error={errors.addTag}
                        touched={!!errors.addTag}
                      />
                      <Button className="whitespace-nowrap" disabled={values.tags.length >= 5 || !!errors.addTag || values.addTag.length < 2} type="button" size="md" onClick={() => {
                        if(values.tags.includes(values.addTag) || !values.addTag) {
                          return;
                        }
                        arrayHelpers.push(values.addTag);
                        setFieldValue('addTag', '');
                      }}>Add Tag</Button>
                    </div>
                    {!!values.tags.length && (
                      <ul className="flex flex-wrap gap-xs">
                        {values.tags.map((tag, index) => (
                          <Button type="button" size="sm" key={index}>{tag} <FaTimes onClick={() => arrayHelpers.remove(index)}/></Button>
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
                      <Text className="cursor-pointer text-primary-light font-bold"
                          onClick={() => {
                            openFlyout(flyoutTypes.forestNew, {
                              title: 'Create forest',
                              callback: (data: CreateForestMutation | undefined) => {
                                if (!data) {
                                  return;
                                }

                                setFieldValue('forests', [{
                                  value: data.createForest.forest.id,
                                  label: data.createForest.forest.name}
                                ]);
                                setFieldValue('forest', data.createForest.forest.id);
                                closeFlyout();
                              }
                            })
                          }}> here</Text>
                    </Text>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm w-full">
                    <Field
                      as={FormField}
                      name="searchForest"
                      className="grow"
                      placeholder="Search..."
                      type="text"
                      onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('forestsLoading', true);
                        setFieldValue('forest', '');
                        const { data, error } = await apolloClient.query({
                          query: QUERY_CHOOSE_FOREST,
                          variables: { filter: { name: { ilike: `%${e.target.value}%` } } },
                        });

                        if(error) {
                          setError(error);
                        }

                        if (data) {
                          setFieldValue('forests', prepareForestOptions(data));
                          setFieldValue('forest', prepareForestOptions(data).shift()?.value);
                        }

                        setFieldValue('forestsLoading', false);
                      }}
                    />
                    <Field
                      as={FormField}
                      className={clsx(values.forestsLoading && 'animate-pulse')}
                      name="forest"
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
              <div className="flex flex-col items-center gap-sm">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="w-full mt-sm">
                  {isEditing ? 'Edit' : 'Create'}
                </Button>
                <Text className="text-xs text-center">You'll be able to edit the story until it has not been continued by other authors.</Text>
              </div>
            </Form>
          )}
        </Formik>
      </AuthRequired>
    </div>
  );
};

export default StoryNew;
