import { useEffect } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Text, Button, Link, FormField } from 'components/ui';
import { getLoginUrl, getProfileMeUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper';
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
  }, [currentUser]);
  
  return (
    <div className="md:max-w-sm p-md m-md border-2 rounded-xl">
      <Text variant="pageTitle" className="flex justify-between items-center">
        Register
        <MdAccountCircle />
      </Text>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={({ email, password }) => register({ variables: { input: { email, password } } })}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().min(10, 'Too Short!').required('Required'),
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
            <ApiError error={error}/>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="my-sm w-full"
            >
              Register
            </Button>
            <div className="text-right text-xs">
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