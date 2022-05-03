import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FormField, Button } from 'components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getLoginUrl } from 'lib/helper/auth';
import { useRouter } from 'next/router';
import AuthFormContainer from '../AuthFormContainer';
import { gql, useMutation } from '@apollo/client';
import { ApiError } from 'components/common';
import { useState } from 'react';

const MUTATION_CHANGE_PASSWORD = gql`
  mutation changePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      passwordChanged
    }
  }
`;

const ChangePasswordForm = ({ user, token }) => {
  const router = useRouter();
  const [error, setError] = useState(false);

  const [changePassword] = useMutation(MUTATION_CHANGE_PASSWORD, {
    onCompleted() {
      router.push(getLoginUrl());
    },
    onError(e) {
      setError(e);
    }
  });

  return (
    <AuthFormContainer title="Change password" icon={MdLockOutline}>
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        onSubmit={({ password }) => changePassword({ variables: { input: { password, user, token } } })}
        validationSchema={Yup.object().shape({
          password: Yup.string().min(10, 'Too short!'),
          confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
        })}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="flex flex-col gap-sm">
            <Field
              as={FormField}
              name="password"
              label="Password"
              type="password"
              placeholder="********"
              error={errors.password}
              touched={touched.password}
            />
            <Field
              as={FormField}
              name="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="********"
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full">
              Update password
            </Button>
            <ApiError error={error} />
          </Form>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default ChangePasswordForm;