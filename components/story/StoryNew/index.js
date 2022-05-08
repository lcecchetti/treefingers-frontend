import { gql, useMutation, useQuery } from '@apollo/client';
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

const MUTATION_STORY_CREATE = gql`
  mutation createStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      story {
        _id
        author {
          _id
          storiesCount
        }
      } 
    }
  }
`;

const QUERY_CHOOSE_FOREST = gql`
  query forests($filter: FilterForestInput) {
    forests(filter: $filter, sort: { storiesCount: DESC }, first: 10) {
      edges {
        node {
          _id
          name
          storiesCount
        }
      }
    }
  }
`;

const StoryNew = ({ parent, forest, className }) => {
  const router = useRouter();
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

  const { data: forestsData, refetch: refetchForests, loading: loadingForests } = useQuery(QUERY_CHOOSE_FOREST, {
    variables: {
      filter: {
        _id: { eq: forest },
      },
    },
    skip: !!parent,
  });

  return (
    <div className={className}>
      <AuthRequired>
        <Formik
          enableReinitialize
          initialValues={{
            title: '',
            content: '',
            forest: forestsData?.forests.edges.slice(0, 1).pop()?.node._id,
            parent: parent?._id,
            addTag: '',
            tags: [],
            forests: forestsData?.forests.edges.map(({ node }) =>({
              value: node._id,
              label: `${node.name} (${node.storiesCount} stories)`,
            })),
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required(true),
            content: Yup.string().required(true),
            forest: Yup.string().when('parent', {
              is: () => !parent,
              then: Yup.string().required(true),
            })
          })}
          onSubmit={({ title, content, parent, tags, forest }, { resetForm }) => createStory({
            variables: { input: { data: {
              title, content, parent, forest, tags
            }}},
            onCompleted: (data) => {
              resetForm();
              gtag.event({
                action: 'create-story',
                category: 'story',
                label: 'success',
              });
              router.push(getStoryUrl(data.createStory.story));
            },
          })}
        >
          {({ isSubmitting, values, setFieldValue, errors, touched }) => (
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
              <FieldArray
                name="tags"
                render={arrayHelpers => (
                  <div className="flex flex-col gap-sm">
                    <div className="flex gap-sm justify-items-stretch items-center">
                      <Field className="grow" name="addTag" as={FormField} type="text" />
                      <Button type="button" size="md" onClick={() => { 
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
                          <Button size="sm" key={index}>{tag} <FaTimes onClick={() => arrayHelpers.remove(index)}/></Button>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              />

              {!values.parent &&
                <div className="flex flex-col gap-sm">
                  <Text>Forest</Text>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm w-full"> 
                    <Field
                      as={FormField} 
                      name="searchForest"
                      className="grow"
                      placeholder="Search..."
                      type="text" 
                      onChange={(e) => {
                        setFieldValue('searchForest', e.target.value);
                        refetchForests({
                          filter: {
                            query: e.target.value,
                          }
                        });
                      }} 
                    />
                    <Field 
                      as={FormField}
                      name="forest"
                      type="select"
                      error={errors.forest}
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

