import { useState } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useApolloClient, useMutation, gql } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { parseError } from 'lib/apollo/error';
import useAuthToken from 'lib/auth/useAuthToken';
import { Text, Button, Link, FormField } from 'components/ui';
import { getLoginUrl } from 'lib/helper';

/**
 * Sign up mutation
 * @type {gql}
 */
const MUTATION_SIGN_UP = gql`
  mutation SignUpMutation($username: String!, $email: String!, $password: String!) {
    register(input: { username: $username, email: $email, password: $password }) {
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
      const { data } = await signUp({
        variables: {
          username: values.username,
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
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().min(10, 'Too Short!').required('Required'),
        })}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <Field
              as={FormField}
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
            />
            <Field
              as={FormField}
              label="Username"
              type="text"
              name="username"
              autoComplete="username"
            />
            <Field
              as={FormField}
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
            />

            {!!apiError && <Text variant="error">{apiError}</Text>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="my-md w-full"
            >
              Register
            </Button>
            <div className="text-right text-xs">
              <Link href={getLoginUrl()}>
                <a>Already have an account? Login</a>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}