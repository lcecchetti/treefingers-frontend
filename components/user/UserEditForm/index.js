import { useMutation, useQuery, gql } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Text, Button, FormField, Spinner } from 'components/ui';
import { ApiError } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { QUERY_USER } from 'components/user';
import * as gtag from 'lib/gtag';

const MUTATION_EDIT_USER = gql`
  mutation editUser($input: EditUserInput!) {
    editUser(input: $input) {
      user {
        id
        bio
      }
    }
  }
`;

const UserEditForm = () => {
  const { currentUser } = useCurrentUser();
  const [editUser, { data: editData, error: editError }] = useMutation(MUTATION_EDIT_USER, {
    onCompleted: () => {
      gtag.event({
        action: 'edit-user',
        category: 'user',
        label: 'success',
      });
    },
    onError: () => {
      gtag.event({
        action: 'edit-user',
        category: 'user',
        label: 'error',
      });
    }
  });
  const { data, loading, error } = useQuery(QUERY_USER, { variables: { filter: { id: { eq: currentUser.id } } } });

  return (
    <div className="flex flex-col gap-md">
      <ApiError error={error}/>
      <Spinner loading={loading}/>
      {data?.user && 
        <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
          bio: data.user.bio,
        }}
        validateOnBlur
        onSubmit={({ confirmPassword, ...data }) => {
          return editUser({ variables: { input: { data } } });
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().min(10, 'Too short!'),
          confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
          bio: Yup.string().max(255, 'Too long!'),
        })}>
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-sm">
              <Field
                as={FormField}
                name="password"
                label="Password"
                type="password"
                placeholder="********"
                error={errors.password}
                touched={touched.password}
              />
              <Field
                as={FormField}
                name="confirmPassword"
                label="Confirm password"
                type="password"
                placeholder="********"
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
              />
              <Field
                as={FormField}
                label="Bio"
                type="textarea"
                name="bio"
                rows="5"
                error={errors.bio}
                touched={touched.bio}
              />
              <ApiError error={editError}/>
              {!!editData?.editUser.user &&
                <Text className="text-success">Successfully updated!</Text>
              }
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="my-sm w-full">
                Edit profile
              </Button>
            </Form>
          )}
        </Formik>
      }
    </div>
  );
};

export default UserEditForm;