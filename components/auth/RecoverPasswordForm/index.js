import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, FormField, Button } from 'components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getLoginUrl, getRegisterUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper/auth';
import { useRouter } from 'next/router';
import AuthFormContainer from '../AuthFormContainer';
import { gql, useMutation } from '@apollo/client';

const MUTATION_RECOVER_PASSWORD = gql`
  mutation recoverPassword($input: RecoverPasswordInput!) {
    recoverPassword(input: $input) {
      token
    }
  }
`;

const RecoverPasswordForm = () => {
  const router = useRouter();

  const [recoverPassword, { error }] = useMutation(MUTATION_RECOVER_PASSWORD, {
    onCompleted: async ({ recoverPassword }) => {      
      console.log('completed')
    },
    onError: (e) => {}
  });

  return (
    <AuthFormContainer title="Recover password" icon={MdLockOutline}>
      <Formik
        initialValues={{
          email: '',
        }}
        onSubmit={({ email }) => alert(email)}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Required'),
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
              className="w-full my-sm">
              Send email
            </Button>
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

export default RecoverPasswordForm;