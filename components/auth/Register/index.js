import { useEffect } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Text, Button, Link, FormField } from 'components/ui';
import { getLoginUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper/auth';
import { getProfileMeUrl } from 'lib/helper/profile';
import { setAuthToken } from 'lib/auth/token';
import { useCurrentUser } from 'lib/auth/currentUser';
import { ApiError } from 'components/common';

/**
 * Register mutation
 * @type {gql}
 */
const MUTATION_REGISTER = gql`
  mutation register($input: RegisterInput!) {
    register(input: $input) {
      token
    }
  }
`;

export default function SignUp() {
  const router = useRouter();
  const client = useApolloClient();
  const currentUser = useCurrentUser();

  const [register, { error }] = useMutation(MUTATION_REGISTER, {
    onCompleted: async ({ register }) => {
      setAuthToken(register.token);
      await client.resetStore();
      const redirect = router.query[PARAM_AUTH_REDIRECT_TO] ?? getProfileMeUrl();
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
    <div className="lg:max-w-sm p-md m-md border-2 rounded-xl flex flex-col gap-md">
      <Text variant="pageTitle" className="flex justify-between items-center">
        Register
        <MdAccountCircle />
      </Text>
      <Formik
        initialValues={{
          email: '',
          password: '',
          username: '',
          bio: '',
        }}
        onSubmit={(data) => register({ variables: { input: { data } } })}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().min(10, 'Too short!').required('Required'),
          username: Yup.string().min(2, 'Too short!').max(32, 'Too long!').matches(/^[a-zA-Z0-9-_.]+$/, 'Only letters, numbers, dots, hyphens and dashes').required('Required'),
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
              className="my-sm w-full">
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
    </div>
  );
}