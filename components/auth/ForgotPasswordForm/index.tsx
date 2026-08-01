import { Controller, useForm } from 'react-hook-form';
import { Link, FormField, Button } from 'components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getLoginUrl, getRegisterUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper/auth';
import { useRouter } from 'next/router';
import AuthFormContainer from '../AuthFormContainer';
import { useMutation, type ApolloError } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { ApiError } from 'components/common';
import * as gtag from 'lib/gtag';
import { useState } from 'react';
import { useUI } from 'lib/ui/context';

const MUTATION_FORGOT_PASSWORD = graphql(`
  mutation forgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      result
    }
  }
`);

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [error, setError] = useState<ApolloError | false>(false);
  const { showToast } = useUI();

  const [forgotPassword] = useMutation(MUTATION_FORGOT_PASSWORD, {
    onCompleted: () => {
      gtag.event({
        action: 'forgot-password',
        category: 'auth',
        label: 'success',
      });
      showToast('Check your emails, we\'ve sent a reset link', { duration: 0 })
      setError(false);
    },
    onError: (e) => {
      gtag.event({
        action: 'forgot-password',
        category: 'auth',
        label: 'error',
      });
      setError(e);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = ({ email }: ForgotPasswordFormValues) =>
    forgotPassword({ variables: { input: { email } } });

  return (
    <AuthFormContainer title="Forgot password" icon={MdLockOutline}>
      <form noValidate className="flex flex-col gap-sm" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          }}
          render={({ field: { ref, ...field } }) => (
            <FormField
              {...field}
              type="email"
              label="Email"
              autoComplete="email"
              autoFocus
              error={errors.email?.message}
              touched={touchedFields.email}
            />
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className="w-full">
          Send email
        </Button>

        <ApiError error={error} />
        <div className="flex flex-col gap-xs text-xs">
          <Link href={getLoginUrl(router.query[PARAM_AUTH_REDIRECT_TO] as string | undefined)}>Already have an account? Login</Link>
          <Link href={getRegisterUrl(router.query[PARAM_AUTH_REDIRECT_TO] as string | undefined)}>Don't have an account? Register</Link>
        </div>
      </form>
    </AuthFormContainer>
  );
};

export default ForgotPasswordForm;
