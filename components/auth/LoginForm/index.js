import { useEffect, useState } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import { useCurrentUser } from 'lib/auth/currentUser';
import { setAuthToken } from 'lib/auth/token';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, FormField, Button, Text } from 'components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getForgotPasswordUrl, getRegisterUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper/auth';
import { getProfileMeUrl } from 'lib/helper/profile';
import { ApiError } from 'components/common';
import AuthFormContainer from '../AuthFormContainer';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

const MUTATION_LOGIN = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      token
      currentUser {
        id
        username
      }
    }
  }
`;

const MUTATION_RESEND_ACTIVATE_ACCOUNT = gql`
  mutation resendActivateAccount($input: ResendActivateAccountInput!) {
    resendActivateAccount(input: $input) {
      result
    }
  }
`;

const LoginForm = () => {
  const router = useRouter();
  const client = useApolloClient();
  const [error, setError] = useState(false);
  const { currentUser } = useCurrentUser();
  const { showToast } = useUI();

  const [login] = useMutation(MUTATION_LOGIN, {
    onCompleted: async ({ login }) => {    
      setAuthToken(login.token);
      await client.resetStore();
      gtag.event({
        action: 'login',
        category: 'auth',
        label: 'success',
      });
      const redirect = router.query[PARAM_AUTH_REDIRECT_TO] ?? '/';
      showToast(`Hey ${login.currentUser.username}, welcome!`);
      router.push(redirect);
    },
    onError: (e) => {
      gtag.event({
        action: 'login',
        category: 'auth',
        label: 'error',
      });
      setError(e);
    }
  });

  const [resendActivateAccount] = useMutation(MUTATION_RESEND_ACTIVATE_ACCOUNT, {
    onCompleted: async () => {    
      setError(false);
      gtag.event({
        action: 'resendActivateAccount',
        category: 'auth',
        label: 'success',
      });
      showToast(`We got you, check your emails`);
    },
    onError: (e) => {
      gtag.event({
        action: 'resendActivateAccount',
        category: 'auth',
        label: 'error',
      });
      setError(e);
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
        {({ isSubmitting, errors, touched, values }) => (
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
            {error && error.graphQLErrors && error.graphQLErrors.length && error.graphQLErrors[0].extensions.code === 'UNAUTHENTICATED' &&
              <div className="flex my-sm">
                <Text>Lost your activation email? Click here to resend</Text>
                <Button size="md" onClick={() => values.email && resendActivateAccount({ variables: { input: { email: values.email } } })}>Send</Button>
              </div>
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