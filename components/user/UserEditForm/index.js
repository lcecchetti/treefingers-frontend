import { useMutation, useQuery, gql } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, FormField, Spinner } from 'components/ui';
import { ApiError } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { QUERY_USER } from 'components/user';

const MUTATION_EDIT_USER = gql`
  mutation editUser($input: EditUserInput!) {
    editUser(input: $input) {
      user {
        _id
        bio
      }
    }
  }
`;

const UserEditForm = () => {
  const currentUser = useCurrentUser();
  const [editUser, { error: editError }] = useMutation(MUTATION_EDIT_USER);
  const { data, loading, error } = useQuery(QUERY_USER, { variables: { filter: { _id: { eq: currentUser._id } } } });

  return (
    <div className="flex flex-col gap-md">
      <ApiError error={error}/>
      <Spinner loading={loading}/>
      {data?.user && 
        <Formik
        initialValues={{
          bio: data.user.bio,
        }}
        validateOnBlur
        onSubmit={({ passwordConfirmation, ...data }) => editUser({ variables: { input: { data } } })}
        validationSchema={Yup.object().shape({
          password: Yup.string().min(10, 'Too short!'),
          passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
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
                name="passwordConfirmation"
                label="Repeat password"
                type="password"
                placeholder="********"
                error={errors.passwordConfirmation}
                touched={touched.passwordConfirmation}
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