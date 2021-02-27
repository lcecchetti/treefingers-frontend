import { useState } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { parseError } from 'lib/apollo/error';
import { Text, Button, Link, FormField } from 'components/ui';
import { getLoginUrl, getProfileMeUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper';
import { setAuthToken } from 'lib/auth';

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
  const [registerError, setRegisterError] = useState('');
  const client = useApolloClient();

  /**
   * Handle signup form submission
   * @param {Object} values
   * @return {Promise<void>}
   */
  const register = async (username, email, password) => {
    try {
      const { data } = await signUp({
        variables: {
          username,
          email,
          password,
        },
      });

      if (data?.register?.jwt) {
        setRegisterError('');
        setAuthToken(data.register.jwt);

        await client.resetStore();
        
        const redirect = router.query[PARAM_AUTH_REDIRECT_TO] ?? getProfileMeUrl();
        router.push(redirect);
      }
    } catch (e) {
      setRegisterError(parseError(e));
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
        onSubmit={({ username, email, password }) => register(username, email, password)}
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
              label="Username"
              type="text"
              name="username"
              autoComplete="username"
              error={errors.username}
              touched={touched.username}
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

            {!!registerError && <Text variant="error">{registerError}</Text>}
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