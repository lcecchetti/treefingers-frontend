import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { FormField, Button } from 'components/ui';
import * as Yup from 'yup';
import { getForestUrl } from 'lib/helper/forest';
import { AuthRequired } from 'components/auth';
import { ApiError } from 'components/common';

/**
 * Create forest mutation
 * @type {gql}
 */
const MUTATION_FOREST_CREATE = gql`
  mutation createForest($input: CreateForestInput!) {
    createForest(input: $input) {
      forest {
        _id
        name
      } 
    }
  }
`;

const ForestNew = () => {
  const [createForest, { error }] = useMutation(MUTATION_FOREST_CREATE, {
    onError: (e) => {},
  });
  const router = useRouter();

  return (
    <div>
      <AuthRequired>
        <Formik
          initialValues={{
            name: '',
            about: '',
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().min(2, 'Too short!').max(32, 'Too long!').matches(/^[a-zA-Z0-9-_.]+$/, 'Only letters, numbers, dots, hyphens and dashes').required('Required'),
            about: Yup.string().required('Required'),
          })}
          onSubmit={({ name, about }) => createForest({
            variables: { input: { data: {
              name, about
            }}},
            onCompleted: (data) => {
              router.push(getForestUrl(data.createForest.forest));
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

