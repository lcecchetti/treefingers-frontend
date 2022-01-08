import { useEffect } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import { useCurrentUser } from 'lib/auth/currentUser';
import { setAuthToken } from 'lib/auth/token';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Text, Link, FormField, Button } from 'components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getRegisterUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper/auth';
import { getProfileMeUrl } from 'lib/helper/profile';
import { ApiError } from 'components/common';

/**
 * Login mutation
 * @type {gql}
 */
const MUTATION_LOGIN = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`;

export default function Login() {
  const router = useRouter();
  const client = useApolloClient();
  const currentUser = useCurrentUser();

  const [login, { error }] = useMutation(MUTATION_LOGIN, {
    onCompleted: async ({ login }) => {      
      setAuthToken(login.token);
      await client.resetStore();
      const redirect = router.query[PARAM_AUTH_REDIRECT_TO] ?? getProfileMeUrl();
      router.push(redirect);
    },
    onError: (e) => {}
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
        Login
        <MdLockOutline />
      </Text>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={({ email, password }) => login({ variables: { input: { email, password } } })}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().min(10, 'Too Short!').required('Required'),
        })}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="flex flex-col gap-sm">
            <Field
              as={FormField}
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              autoFocus
              error={errors.email}
              touched={touched.email}
            />
            <Field
              as={FormField}
              name="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              error={errors.password}
              touched={touched.password}
            />
            <ApiError error={error} />
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full my-sm">
              Login
            </Button>
            <div className="flex flex-row justify-between">
              <Link className="text-left text-xs">Forgot password?</Link>
              <Link href={getRegisterUrl(router.query[PARAM_AUTH_REDIRECT_TO])} className="text-right text-xs">Don't have an account?<br />Register</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}