import { useState } from 'react';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { parseError } from 'lib/apollo/error';
import { useRouter } from 'next/router';
import useAuthToken from 'lib/auth/useAuthToken';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

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
  const { setAuthToken } = useAuthToken();
  const [apiError, setApiError] = useState('');

  /**
   * Handle signin form submission
   * @param {string} email
   * @param {string} password
   * @return {Promise<void>}
   */
  async function handleSubmit(email, password) {
    try {
      const { data } = await signIn({
        variables: {
          email: email,
          password: password,
        },
      });

      if (data?.login?.jwt) {
        setApiError('');
        setAuthToken(data.login.jwt)
        router.push('/profile/me')
      }
    } catch (e) {
      setApiError(parseError(e).message);
    }
  };

  return (
    <div>
      <div>
        <span>Icon</span>
      </div>
      <h1>
        Sign in
      </h1>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={({ email, password }) => handleSubmit(email, password)}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().min(10, 'Too Short!').required('Required'),
        })}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              name="email"
              type="text"
              placeholder="email"
              autoComplete="email"
              autoFocus
            />
            <Field
              name="password"
              type="password"
              placeholder="password"
              autoComplete="current-password"
            />
            {!!apiError &&
              <p>{apiError}</p>
            }
            <button
              type="submit"
              disabled={isSubmitting}
            >
              Login
            </button>
            <div>
              <div>
                <Link href="/#">
                  <a>Forgot password?</a>
                </Link>
              </div>
              <div>
                <Link href="/auth/register">
                  <a>Don't have an account? Register</a>
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}