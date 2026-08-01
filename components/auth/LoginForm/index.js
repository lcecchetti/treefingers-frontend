import { useEffect, useState } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import { useCurrentUser } from 'lib/auth/currentUser';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, FormField, Button, Text } from 'components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getForgotPasswordUrl, getRegisterUrl, getSafeRedirect, PARAM_AUTH_REDIRECT_TO } from 'lib/helper/auth';
import { getProfileMeUrl } from 'lib/helper/profile';
import { ApiError } from 'components/common';
import AuthFormContainer from '../AuthFormContainer';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

const MUTATION_LOGIN = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
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
  const [resendActivateAccountTo, setResendActivateAccountTo] = useState(false);
  const { currentUser } = useCurrentUser();
  const { showToast } = useUI();

  const [login] = useMutation(MUTATION_LOGIN, {
    onCompleted: async ({ login }) => {
      setResendActivateAccountTo(false);
      // the backend already set the auth cookie via Set-Cookie on this response
      await client.resetStore();
      gtag.event({
        action: 'login',
        category: 'auth',
        label: 'success',
      });
      const redirect = getSafeRedirect(router.query[PARAM_AUTH_REDIRECT_TO]) ?? '/';
      showToast(`Hey ${login.currentUser.username}, welcome!`);
      router.push(redirect);
    },
  });

  const [resendActivateAccount] = useMutation(MUTATION_RESEND_ACTIVATE_ACCOUNT, {
    onCompleted: async () => {    
      gtag.event({
        action: 'resend-activate-account',
        category: 'auth',
        label: 'success',
      });
      showToast(`We got you, check your emails`);
      setResendActivateAccountTo(false);
      setError(false);
    },
    onError: (e) => {
      gtag.event({
        action: 'resend-activate-account',
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
        onSubmit={({ email, password }) => login({ 
          variables: { input: { email, password } }, 
          onError: (e) => {
            gtag.event({
              action: 'login',
              category: 'auth',
              label: 'error',
            });
            setError(e);
            if (e.graphQLErrors && e.graphQLErrors.length && e.graphQLErrors[0].message === 'Your account is not active yet, check your emails.') {
              setResendActivateAccountTo(email);
            }
          },
        })}
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
            {!!error && resendActivateAccountTo &&
              <div className="flex mb-sm items-center">
                <Text className="text-sm">Lost your activation email? No problem we'll resend it</Text>
                <Button type="button" onClick={() => {
                  resendActivateAccountTo && 
                  resendActivateAccount({ variables: { input: { email: resendActivateAccountTo } } })}}>
                  Send
                </Button>
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