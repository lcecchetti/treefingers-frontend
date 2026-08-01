import { Controller, useForm } from 'react-hook-form';
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

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = ({ password }: ChangePasswordFormValues) =>
    changePassword({ variables: { input: { password, token } } });

  return (
    <AuthFormContainer title="Change password" icon={MdLockOutline}>
      <form noValidate className="flex flex-col gap-sm" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="password"
          control={control}
          rules={{ minLength: { value: 10, message: 'Too short!' } }}
          render={({ field: { ref, ...field } }) => (
            <FormField
              {...field}
              label="Password"
              type="password"
              placeholder="********"
              error={errors.password?.message}
              touched={touchedFields.password}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            validate: (value, { password }) => value === password || 'Passwords must match',
          }}
          render={({ field: { ref, ...field } }) => (
            <FormField
              {...field}
              label="Confirm password"
              type="password"
              placeholder="********"
              error={errors.confirmPassword?.message}
              touched={touchedFields.confirmPassword}
            />
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className="w-full">
          Update password
        </Button>
        <ApiError error={error} />
      </form>
    </AuthFormContainer>
  );
};

export default ChangePasswordForm;
