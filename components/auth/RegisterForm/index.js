import { useEffect, useState } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useMutation, gql } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Link, FormField } from 'components/ui';
import { getLoginUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper/auth';
import { getProfileMeUrl } from 'lib/helper/profile';
import { useCurrentUser } from 'lib/auth/currentUser';
import { ApiError } from 'components/common';
import AuthFormContainer from '../AuthFormContainer';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

const MUTATION_REGISTER = gql`
  mutation register($input: RegisterInput!) {
    register(input: $input) {
      result
    }
  }
`;

const RegisterForm = () => {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState(false);
  const { showToast } = useUI();

  const [register] = useMutation(MUTATION_REGISTER, {
    onError: (e) => {
      gtag.event({
        action: 'login',
        category: 'auth',
        label: 'error',
      });
      setError(e);
    },
  });

  // logged in users should not visit login/register page
  useEffect(() => {
    if (currentUser) {
      router.push(getProfileMeUrl());
    }
  }, [!currentUser]);
  
  return (
    <AuthFormContainer title="Register" icon={MdAccountCircle}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          username: '',
          bio: '',
        }}
        onSubmit={({ confirmPassword, ...data }, { resetForm }) => register({ variables: { input: { data } }, 
          onCompleted: async () => {
            resetForm();
            gtag.event({
              action: 'register',
              category: 'auth',
              label: 'success',
            });
            showToast('Check your emails to activate your account', { duration: 0 });
            router.push(getLoginUrl());
          }, 
        })}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required(true),
          password: Yup.string().min(10, 'Too short!').required(true),
          confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
          username: Yup.string().min(3, 'Too short!').max(20, 'Too long!').matches(/^[a-zA-Z0-9-_.]+$/, 'Only letters, numbers, dots, hyphens and dashes').required(true),
          bio: Yup.string().max(4096, 'Too long!'),
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
              error={errors.password}
              touched={touched.password}
            />
            <Field
                as={FormField}
                name="confirmPassword"
                label="Confirm password"
                type="password"
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
              />
            <Field
              as={FormField}
              label="Username"
              type="text"
              name="username"
              hint="Only letters, numbers, dots, hyphens and dashes"
              error={errors.username}
              touched={touched.username}
            />
            <Field
              as={FormField}
              label="Bio"
              type="textarea"
              name="bio"
              error={errors.bio}
              touched={touched.bio}
            />
            <ApiError error={error}/>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full">
              Register
            </Button>
            <div className="text-xs">
              <Link href={getLoginUrl(router.query[PARAM_AUTH_REDIRECT_TO])}>
                Already have an account? Login
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default RegisterForm;