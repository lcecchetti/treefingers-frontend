import { useState } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { parseError } from 'lib/apollo/error';
import { useRouter } from 'next/router';
import { setAuthToken } from 'lib/auth/token';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Text, Link, FormField, Button } from 'components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getRegisterUrl, getProfileMeUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper';

/**
 * Sign in mutation
 * @type {gql}
 */
const MUTATION_SIGN_IN = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    login(input: { identifier: $email, password: $password }) {
      jwt
    }
  }
`;

export default function Login() {
  const [signIn] = useMutation(MUTATION_SIGN_IN);
  const router = useRouter();
  const [loginError, setLoginError] = useState('');
  const client = useApolloClient();

  /**
   * Handle signin form submission
   * @param {string} email
   * @param {string} password
   * @return {Promise<void>}
   */
  const login = async (email, password) => {
    try {

      const { data } = await signIn({
        variables: {
          email,
          password,
        },
      });

      if (data?.login?.jwt) {
        setLoginError('');
        setAuthToken(data.login.jwt);
        await client.resetStore();

        const redirect = router.query[PARAM_AUTH_REDIRECT_TO] ?? getProfileMeUrl();
        router.push(redirect);
      }
    } catch (e) {
      setLoginError(parseError(e));
    }
  };

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
        onSubmit={({ email, password }) => login(email, password)}
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
            {!!loginError &&
              <Text variant="error">{loginError}</Text>
            }
            <Button
              type="submit"
              disabled={isSubmitting}
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