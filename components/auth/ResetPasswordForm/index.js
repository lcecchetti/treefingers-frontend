import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Text, Link, FormField, Button } from 'components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getLoginUrl, getRegisterUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper/auth';
import { useRouter } from 'next/router';
import AuthFormContainer from '../AuthFormContainer';
import { gql, useMutation } from '@apollo/client';
import { ApiError } from 'components/common';

const MUTATION_RESET_PASSWORD = gql`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      emailSent
    }
  }
`;

const ResetPasswordForm = () => {
  const router = useRouter();

  const [resetPassword, { data, error }] = useMutation(MUTATION_RESET_PASSWORD);

  return (
    <AuthFormContainer title="Reset password" icon={MdLockOutline}>
      <Formik
        initialValues={{
          email: '',
        }}
        onSubmit={({ email }) => resetPassword({ variables: { input: { email } } })}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required(true),
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
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full">
              Send email
            </Button>

            {data?.resetPassword.emailSent &&
              <Text className="text-success">
                Check your emails, we've sent a reset link
              </Text>
            }

            <ApiError error={error} />
            <div className="flex flex-col gap-xs text-xs">
              <Link href={getLoginUrl(router.query[PARAM_AUTH_REDIRECT_TO])}>Already have an account? Login</Link>
              <Link href={getRegisterUrl(router.query[PARAM_AUTH_REDIRECT_TO])}>Don't have an account? Register</Link>
            </div>
          </Form>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default ResetPasswordForm;