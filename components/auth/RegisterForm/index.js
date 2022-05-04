import { useEffect } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Link, FormField } from 'components/ui';
import { getLoginUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper/auth';
import { useCurrentUser } from 'lib/auth/currentUser';
import { ApiError } from 'components/common';
import AuthFormContainer from '../AuthFormContainer';

const MUTATION_REGISTER = gql`
  mutation register($input: RegisterInput!) {
    register(input: $input) {
      registrationResult
    }
  }
`;

const RegisterForm = () => {
  const router = useRouter();
  const client = useApolloClient();
  const { currentUser } = useCurrentUser();

  const [register, { error }] = useMutation(MUTATION_REGISTER, {
    onCompleted: async ({ register }) => {
      await client.resetStore();
      const redirect = router.query[PARAM_AUTH_REDIRECT_TO] ?? getLoginUrl();
      router.push(redirect);
    },
    onError: (e) => {},
  });

  // logged in users should not visit login/register page
  useEffect(() => {
    if (currentUser) {
      router.push(getProfileMeUrl());
    }
  }, [!currentUser]);
  
  return (
    <AuthFormContainer title="Register" icon={MdAccountCircle}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          username: '',
          bio: '',
        }}
        onSubmit={(data) => register({ variables: { input: { data } } })}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required(true),
          password: Yup.string().min(10, 'Too short!').required(true),
          username: Yup.string().min(2, 'Too short!').max(32, 'Too long!').matches(/^[a-zA-Z0-9-_.]+$/, 'Only letters, numbers, dots, hyphens and dashes').required(true),
          bio: Yup.string().max(255, 'Too long!'),
        })}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="flex flex-col gap-sm">
            <Field
              as={FormField}
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              error={errors.email}
              touched={touched.email}
            />
            <Field
              as={FormField}
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password}
              touched={touched.password}
            />
            <Field
              as={FormField}
              label="Username"
              type="text"
              name="username"
              hint="Only letters, numbers, dots, hyphens and dashes"
              error={errors.username}
              touched={touched.username}
            />
            <Field
              as={FormField}
              label="Bio"
              type="textarea"
              name="bio"
              error={errors.bio}
              touched={touched.bio}
            />
            <ApiError error={error}/>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full">
              Register
            </Button>
            <div className="text-xs">
              <Link href={getLoginUrl(router.query[PARAM_AUTH_REDIRECT_TO])}>
                Already have an account? Login
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default RegisterForm;