import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FormField, Button } from 'components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getLoginUrl } from 'lib/helper/auth';
import { useRouter } from 'next/router';
import AuthFormContainer from '../AuthFormContainer';
import { useMutation, type ApolloError } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { ApiError } from 'components/common';
import { useState } from 'react';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

const MUTATION_CHANGE_PASSWORD = graphql(`
  mutation changePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      result
    }
  }
`);

interface ChangePasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface ChangePasswordFormProps {
  token: string;
}

const ChangePasswordForm = ({ token }: ChangePasswordFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<ApolloError | false>(false);
  const { showToast } = useUI();

  const [changePassword] = useMutation(MUTATION_CHANGE_PASSWORD, {
    onCompleted() {
      gtag.event({
        action: 'change-password',
        category: 'auth',
        label: 'success',
      });
      showToast('Your password has been changed', { type: 'success' });
      router.push(getLoginUrl());
    },
    onError(e) {
      gtag.event({
        action: 'change-password',
        category: 'auth',
        label: 'error',
      });
      setError(e);
    }
  });

  return (
    <AuthFormContainer title="Change password" icon={MdLockOutline}>
      <Formik<ChangePasswordFormValues>
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        onSubmit={({ password }) => changePassword({ variables: { input: { password, token } } })}
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
