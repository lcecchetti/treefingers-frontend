import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field, FieldArray } from 'formik';
import { FormField, Button } from 'components/ui';
import * as Yup from 'yup';
import { AuthRequired } from 'components/auth';
import { ApiError } from 'components/common';
import { FaTimes } from 'react-icons/fa';
import * as gtag from 'lib/gtag';
import { useState } from 'react';
import { useUI } from 'lib/ui/context';

const MUTATION_STORY_EDIT = gql`
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
`;

const StoryEdit = ({ story, callback, className }) => {
  const { showToast } = useUI();
  const [error, setError] = useState(false);
  const [editStory] = useMutation(MUTATION_STORY_EDIT);

  return (
    <div className={className}>
      <AuthRequired>
        <Formik
          enableReinitialize
          initialValues={{
            title: story.title,
            content: story.content,
            addTag: '',
            tags: story.tags,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().max(64, 'Too long!').required(true),
            content: Yup.string().max(4096, 'Too long!').required(true),
            addTag: Yup.string().matches(/^[a-zA-Z0-9_]*$/, 'Tag must not contain special chars or spaces!').max(16, 'Too long'),
          })}
          onSubmit={({ title, content, tags }, { setSubmitting, resetForm }) => editStory({
            variables: { input: { 
              id: story.id, 
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
              showToast('Your story has been updated!');
              setError(false);

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
                        touched={errors.addTag}
                      />
                      <Button className="whitespace-nowrap" disabled={values.tags.length >= 5 || errors.addTag || values.addTag.length < 2} type="button" size="md" onClick={() => { 
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

              <ApiError error={error} />
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full mt-sm">
                Edit
                </Button>
            </Form>
          )}
        </Formik>
      </AuthRequired>
    </div>
  );
};

export default StoryEdit;

