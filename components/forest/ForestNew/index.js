import { gql, useMutation } from '@apollo/client';
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

const MUTATION_FOREST_CREATE = gql`
  mutation createForest($input: CreateForestInput!) {
    createForest(input: $input) {
      forest {
        id
        name
      } 
    }
  }
`;

const ForestNew = ({ className, afterCreationCallback }) => {
  const [error, setError] = useState(false);
  const [createForest] = useMutation(MUTATION_FOREST_CREATE, {
    onError: (e) => {
      gtag.event({
        action: 'create-forest',
        category: 'forest',
        label: 'error',
      });
      setError(e);
    },
  });
  const router = useRouter();
  const { showToast } = useUI();

  return (
    <div className={className}>
      <AuthRequired>
        <Formik
          initialValues={{
            name: '',
            about: '',
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(21, 'Too long!').matches(/^[a-zA-Z0-9-_.]+$/, 'Only letters, numbers, dots, hyphens and dashes').required(true),
            about: Yup.string().max(4096, 'Too long!').required(true),
          })}
          onSubmit={({ name, about }, { resetForm }) => createForest({
            variables: { input: { data: {
              name, about
            }}},
            onCompleted: (data) => {
              gtag.event({
                action: 'create-forest',
                category: 'forest',
                label: 'success',
              });
              showToast(`${data.createForest.forest.name} created!`);
              if (afterCreationCallback) {
                afterCreationCallback();
              } else {
                router.push(getForestUrl(data.createForest.forest));
              }

              resetForm();
            },
          })}>
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-sm">
              <Field
                as={FormField}
                name="name"
                type="text"
                label="Name"
                hint="Only letters, numbers, dots, hyphens and dashes"
                error={errors.name}
                touched={touched.name}
              />
              <Field
                as={FormField}
                name="about"
                type="textarea"
                label="About"
                rows="10"
                error={errors.about}
                touched={touched.about}
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

export default ForestNew;

