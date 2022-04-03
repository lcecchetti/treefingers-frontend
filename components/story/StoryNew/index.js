import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { Formik, Form, Field, FieldArray } from 'formik';
import { FormField, Button, Text } from 'components/ui';
import * as Yup from 'yup';
import { getStoryUrl } from 'lib/helper/story';
import { AuthRequired } from 'components/auth';
import { ApiError } from 'components/common';
import { FaTimes } from 'react-icons/fa';

/**
 * Create story mutation
 * @type {gql}
 */
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

const StoryNew = ({ parent, forest, className }) => {
  const [createStory, { error }] = useMutation(MUTATION_STORY_CREATE, {
    onError: (e) => {},
  });
  const router = useRouter();

  return (
    <div className={className}>
      <AuthRequired>
        <Formik
          enableReinitialize
          initialValues={{
            title: '',
            content: '',
            forest: forest?._id,
            parent: parent?._id,
            addTag: '',
            tags: [],
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Required'),
            content: Yup.string().required('Required'),
          })}
          onSubmit={({ title, content, parent, tags, forest }, { resetForm }) => createStory({
            variables: { input: { data: {
              title, content, parent, forest, tags
            }}},
            onCompleted: (data) => {
              resetForm();
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
                      <Button type="button" onClick={() => { 
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

