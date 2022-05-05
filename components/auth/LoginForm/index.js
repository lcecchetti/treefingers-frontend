import { useEffect } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import { useCurrentUser } from 'lib/auth/currentUser';
import { setAuthToken } from 'lib/auth/token';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Text, Link, FormField, Button } from 'components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getForgotPasswordUrl, getRegisterUrl, PARAM_AUTH_REDIRECT_TO, PARAM_AUTH_FROM } from 'lib/helper/auth';
import { getProfileMeUrl } from 'lib/helper/profile';
import { ApiError } from 'components/common';
import AuthFormContainer from '../AuthFormContainer';
import * as gtag from 'lib/gtag';

const MUTATION_LOGIN = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`;

const LoginForm = () => {
  const router = useRouter();
  const client = useApolloClient();
  const { currentUser } = useCurrentUser();

  const [login, { error }] = useMutation(MUTATION_LOGIN, {
    onCompleted: async ({ login }) => {      
      setAuthToken(login.token);
      await client.resetStore();
      gtag.event({
        action: 'login',
        category: 'auth',
        label: 'success',
      });
      const redirect = router.query[PARAM_AUTH_REDIRECT_TO] ?? getProfileMeUrl();
      router.push(redirect);
    },
    onError: (e) => {
      gtag.event({
        action: 'login',
        category: 'auth',
        label: 'error',
      });
    }
  });

  // logged in users should not visit login/register page
  useEffect(() => {
    if (currentUser) {
      router.push(getProfileMeUrl());
    }
  }, [!currentUser]);

  return (
    <AuthFormContainer title="Login" icon={MdLockOutline}>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={({ email, password }) => login({ variables: { input: { email, password } } })}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required(true),
          password: Yup.string().required(true),
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
            {router.query[PARAM_AUTH_FROM] === 'activated' &&
              <Text variant="success">Your account is now active. See you around!</Text>
            }
            {router.query[PARAM_AUTH_FROM] === 'newUser' &&
              <Text variant="success">Welcome! Check your emails to activate your account</Text>
            }
            {router.query[PARAM_AUTH_FROM] === 'passwordChanged' &&
              <Text variant="success">Your password has been updated</Text>
            }
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full">
              Login
            </Button>
            <div className="flex flex-col gap-xs text-xs">
              <Link href={getForgotPasswordUrl(router.query[PARAM_AUTH_REDIRECT_TO])}>Forgot password?</Link>
              <Link href={getRegisterUrl(router.query[PARAM_AUTH_REDIRECT_TO])}>Don't have an account? Register</Link>
            </div>
          </Form>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default LoginForm;