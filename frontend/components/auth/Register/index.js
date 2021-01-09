import { useState } from 'react';
import Link from 'next/link';
import { MdLockOutline } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useApolloClient, useMutation, gql } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { parseError } from 'lib/apollo/error';
import useAuthToken from 'lib/auth/useAuthToken';

/**
 * Sign up mutation
 * @type {gql}
 */
const MUTATION_SIGN_UP = gql`
  mutation SignUpMutation($email: String!, $password: String!) {
    register(input: { username: $email, email: $email, password: $password }) {
      jwt
    }
  }
`;

export default function SignUp() {
  const [signUp] = useMutation(MUTATION_SIGN_UP);
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const { setAuthToken } = useAuthToken();
  const client = useApolloClient();

  /**
   * Handle signup form submission
   * @param {Object} values
   * @return {Promise<void>}
   */
  async function handleSubmit(values) {
    try {
      await client.resetStore();
      const { data } = await signUp({
        variables: {
          email: values.email,
          password: values.password,
        },
      });

      if (data?.register?.jwt) {
        setApiError('');
        setAuthToken(data.register.jwt)
        router.push('/')
      }
    } catch (e) {
      console.log(e);
      setApiError(parseError(e).message);
    }
  };

  return (
    <div>
      <div>
        <MdLockOutline />
      </div>
      <h1>
        Sign up
      </h1>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().min(10, 'Too Short!').required('Required'),
        })}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <div>
              <div>
                <Field
                  placeholder="Email address"
                  label="Email Address"
                  type="email"
                  name="email"
                  autoComplete="email"
                />
              </div>
              <div>
                <Field
                  placeholder="password"
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
              </div>
            </div>
            {!!apiError && <p>{apiError}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
            >
              Register
            </button>
            <div>
              <div>
                <Link href="/auth/signin">
                  <a>Already have an account? Login</a>
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}