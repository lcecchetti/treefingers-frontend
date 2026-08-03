'use client';

import { useApolloClient, useMutation, useQuery, type ApolloError } from '@apollo/client';
import { graphql } from '@/lib/graphql/generated';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField, Button, Text } from '@/components/ui';
import type { FormFieldOption } from '@/components/ui/form-field';
import { getStoryUrl } from '@/lib/helper/story';
import { AuthRequired } from '@/components/auth';
import { ApiError } from '@/components/common';
import { FaTimes } from 'react-icons/fa';
import * as analytics from '@/lib/analytics';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { flyoutTypes, useUI } from '@/lib/ui/context';
import type { ChooseForestQuery, CreateForestMutation } from '@/lib/graphql/generated/graphql';

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

// the forest field is only required when the user has to pick one (no parent chapter, not editing)
const getStoryNewSchema = (hasForestSelection: boolean) => z.object({
  title: z.string().min(1, 'Required').max(64, 'Too long!'),
  content: z.string().min(1, 'Required').max(4096, 'Too long!'),
  addTag: z.string().max(16, 'Too long').regex(/^[a-zA-Z0-9_]*$/, 'Tag must not contain special chars or spaces!'),
  tags: z.array(z.string()),
  forest: hasForestSelection ? z.string().min(1, 'Required') : z.string(),
});

type StoryNewFormValues = z.infer<ReturnType<typeof getStoryNewSchema>>;

export const StoryNew = ({ story, parent, forest, callback, className }: StoryNewProps) => {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const { openFlyout, closeFlyout, showToast } = useUI();
  const [error, setError] = useState<ApolloError | false>(false);
  const [createStory] = useMutation(MUTATION_STORY_CREATE);
  const [editStory] = useMutation(MUTATION_STORY_EDIT);

  const isEditing = !!story;
  const hasForestSelection = !parent && !isEditing;

  const { data: forestsData, loading: forestsLoadingQuery } = useQuery(QUERY_CHOOSE_FOREST, {
    variables: {
      filter: forest ? { id: { eq: forest } } : {},
    },
    skip: !hasForestSelection,
  });

  const [forests, setForests] = useState<FormFieldOption[]>([]);
  const [forestsLoading, setForestsLoading] = useState(forestsLoadingQuery);
  const [searchForest, setSearchForest] = useState('');

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

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm<StoryNewFormValues>({
    resolver: zodResolver(getStoryNewSchema(hasForestSelection)),
    defaultValues: {
      title: story?.title || '',
      content: story?.content || '',
      addTag: '',
      tags: story?.tags || [],
      forest: '',
    },
  });

  useEffect(() => {
    if (forestsData) {
      const options = prepareForestOptions(forestsData);
      setForests(options);
      setValue('forest', options[0]?.value as string ?? '');
    }
  }, [forestsData]);

  const tags = watch('tags');
  const addTag = watch('addTag');
  const currentForest = watch('forest');

  const onSubmit = ({ title, content, tags, forest }: StoryNewFormValues) => {
    if (isEditing) {
      return editStory({
        variables: { input: {
          id: story!.id,
          data: {
            title, content, tags
          },
        }},
        onCompleted: () => {
          analytics.event({
            action: 'edit-story',
            category: 'story',
            label: 'success',
          });

          reset();
          setError(false);
          showToast(`Your ${story!.parent ? 'chapter' : 'story'} has been updated!`);
          if (callback) {
            callback();
          }
        },
        onError: (e) => {
          analytics.event({
            action: 'edit-story',
            category: 'story',
            label: 'error',
          });
          setError(e);
        }
      });
    } else {
      return createStory({
        variables: { input: { data: {
          title, content, parent: parent?.id, forest, tags
        }}},
        onCompleted: (data) => {
          analytics.event({
            action: 'create-story',
            category: 'story',
            label: 'success',
          });

          reset();
          if (parent) {
            showToast('Chapter created!');
          } else {
            showToast('Story planted!');
          }
          setError(false);
          router.push(getStoryUrl(data.createStory.story));
        },
        onError: (e) => {
          analytics.event({
            action: 'create-story',
            category: 'story',
            label: 'error',
          });
          setError(e);
        }
      });
    }
  };

  return (
    <div className={className}>
      <AuthRequired>
        <form noValidate className="flex flex-col gap-sm" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormField
                {...field}
                type="text"
                label={!parent ? 'Title' : 'Action'}
                error={errors.title?.message}
                touched={touchedFields.title}
                hint={parent ? 'This will appear as the action to choose from on the parent chapter' : ''}
              />
            )}
          />
          <Controller
            name="content"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormField
                {...field}
                type="textarea"
                label="Content"
                rows={10}
                error={errors.content?.message}
                touched={touchedFields.content}
              />
            )}
          />
          <div className="flex flex-col gap-sm">
            <div className="flex gap-sm justify-items-stretch items-end">
              <Controller
                name="addTag"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <FormField
                    {...field}
                    className="grow"
                    type="text"
                    label="Tag your story"
                    error={errors.addTag?.message}
                    touched={!!errors.addTag}
                  />
                )}
              />
              <Button className="whitespace-nowrap" disabled={tags.length >= 5 || !!errors.addTag || addTag.length < 2} type="button" size="md" onClick={() => {
                if (tags.includes(addTag) || !addTag) {
                  return;
                }
                setValue('tags', [...tags, addTag]);
                setValue('addTag', '');
              }}>Add Tag</Button>
            </div>
            {!!tags.length && (
              <ul className="flex flex-wrap gap-xs">
                {tags.map((tag, index) => (
                  <Button type="button" size="sm" key={index}>{tag} <FaTimes onClick={() => setValue('tags', tags.filter((_, i) => i !== index))}/></Button>
                ))}
              </ul>
            )}
          </div>

          {hasForestSelection &&
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

                            setForests([{
                              value: data.createForest.forest.id,
                              label: data.createForest.forest.name}
                            ]);
                            setValue('forest', data.createForest.forest.id);
                            closeFlyout();
                          }
                        })
                      }}> here</Text>
                </Text>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm w-full">
                <FormField
                  name="searchForest"
                  className="grow"
                  placeholder="Search..."
                  type="text"
                  value={searchForest}
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchForest(e.target.value);
                    setForestsLoading(true);
                    setValue('forest', '');
                    const { data, error } = await apolloClient.query({
                      query: QUERY_CHOOSE_FOREST,
                      variables: { filter: { name: { ilike: `%${e.target.value}%` } } },
                    });

                    if(error) {
                      setError(error);
                    }

                    if (data) {
                      const options = prepareForestOptions(data);
                      setForests(options);
                      setValue('forest', (options[0]?.value as string) ?? '');
                    }

                    setForestsLoading(false);
                  }}
                />
                <Controller
                  name="forest"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <FormField
                      {...field}
                      className={clsx(forestsLoading && 'animate-pulse')}
                      type="select"
                      error={errors.forest?.message}
                      disabled={!currentForest}
                      touched={touchedFields.forest}
                      options={forests}
                    />
                  )}
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
            <Text className="text-xs text-center">You'll be able to edit the story until other authors continue it.</Text>
          </div>
        </form>
      </AuthRequired>
    </div>
  );
};
