import { useMutation, type ApolloError } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { FormField, Button } from 'components/ui';
import * as Yup from 'yup';
import { getForestUrl } from 'lib/helper/forest';
import { AuthRequired } from 'components/auth';
import { ApiError } from 'components/common';
import * as gtag from 'lib/gtag';
import { useState } from 'react';
import { useUI } from 'lib/ui/context';

const MUTATION_FOREST_CREATE = graphql(`
  mutation createForest($input: CreateForestInput!) {
    createForest(input: $input) {
      forest {
        id
        name
      }
    }
  }
`);

const MUTATION_FOREST_EDIT = graphql(`
  mutation editForest($input: EditForestInput!) {
    editForest(input: $input) {
      forest {
        id
        about
      }
    }
  }
`);

interface ForestNewFormValues {
  forest?: { id: string; about?: string } | null;
  name: string;
  about: string;
}

interface ForestNewProps {
  className?: string;
  forest?: { id: string; about?: string } | null;
  callback?: (data: unknown) => void;
}

const ForestNew = ({ className, forest, callback }: ForestNewProps) => {
  const [error, setError] = useState<ApolloError | false>(false);
  const [createForest] = useMutation(MUTATION_FOREST_CREATE);
  const [editForest] = useMutation(MUTATION_FOREST_EDIT);
  const router = useRouter();
  const { showToast } = useUI();
  const isEditing = !!forest;

  return (
    <div className={className}>
      <AuthRequired>
        <Formik<ForestNewFormValues>
          enableReinitialize
          initialValues={{
            forest,
            name: '',
            about: forest?.about || '',
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().when('forest', {
              is: () => !forest,
              then: Yup.string().max(21, 'Too long!').matches(/^[a-zA-Z0-9-_.]+$/, 'Only letters, numbers, dots, hyphens and dashes').required(),
            }),
            about: Yup.string().max(4096, 'Too long!').required(),
          })}
          onSubmit={({ name, about, forest }, { resetForm, setSubmitting }) => {
            if (isEditing) {
              editForest({
                variables: { input: {
                  id: forest!.id,
                  data: { about }}
                },
                onCompleted: (data) => {
                  resetForm();
                  gtag.event({
                    action: 'edit-forest',
                    category: 'forest',
                    label: 'success',
                  });
                  showToast(`Your forest has been updated!`);
                  if (callback) {
                    callback(data);
                  }

                  setError(false);
                },
                onError: (e) => {
                  gtag.event({
                    action: 'edit-forest',
                    category: 'forest',
                    label: 'error',
                  });
                  setError(e);
                  setSubmitting(false);
                }
              });
            } else {
              createForest({
                variables: { input: { data: {
                  name, about
                }}},
                onCompleted: (data) => {
                  resetForm();
                  gtag.event({
                    action: 'create-forest',
                    category: 'forest',
                    label: 'success',
                  });
                  showToast(`${data.createForest.forest.name} created!`);
                  if (callback) {
                    callback(data);
                  } else {
                    router.push(getForestUrl(data.createForest.forest));
                  }

                  setError(false);
                },
                onError: (e) => {
                  gtag.event({
                    action: 'create-forest',
                    category: 'forest',
                    label: 'error',
                  });
                  setError(e);
                  setSubmitting(false);
                }
              });
            }
          }}>
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-sm">
              {!isEditing &&
                <Field
                  as={FormField}
                  name="name"
                  type="text"
                  label="Name"
                  hint="Only letters, numbers, dots, hyphens and dashes (It cannot be edited)"
                  error={errors.name}
                  touched={touched.name} />
              }
              <Field
                as={FormField}
                name="about"
                type="textarea"
                label="About"
                hint="Introduce your forest to new joiners"
                rows="10"
                error={errors.about}
                touched={touched.about} />
              <ApiError error={error} />
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full mt-sm">
                {isEditing ? 'Edit' : 'Create'}
                </Button>
            </Form>
          )}
        </Formik>
      </AuthRequired>
    </div>
  );
};

export default ForestNew;
