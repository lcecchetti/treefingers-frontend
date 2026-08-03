'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, FormField, Button } from '@/components/ui';
import { Lock } from 'lucide-react';
import { getLoginUrl, getRegisterUrl, PARAM_AUTH_REDIRECT_TO } from '@/lib/helper/auth';
import { useSearchParams } from 'next/navigation';
import { AuthFormContainer } from './auth-form-container';
import { useMutation } from '@apollo/client/react';
import type { ErrorLike } from '@apollo/client';
import { graphql } from '@/lib/graphql/generated';
import { ApiError } from '@/components/common';
import * as analytics from '@/lib/analytics';
import { useState } from 'react';
import { useUI } from '@/lib/ui/context';

const MUTATION_FORGOT_PASSWORD = graphql(`
  mutation forgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      result
    }
  }
`);

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Required').regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<ErrorLike | false>(false);
  const { showToast } = useUI();

  const [forgotPassword] = useMutation(MUTATION_FORGOT_PASSWORD, {
    onCompleted: () => {
      analytics.event({
        action: 'forgot-password',
        category: 'auth',
        label: 'success',
      });
      showToast('Check your emails, we\'ve sent a reset link', { duration: 0 })
      setError(false);
    },
    onError: (e) => {
      analytics.event({
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
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = ({ email }: ForgotPasswordFormValues) =>
    // Apollo v4's execute promise rejects on error even when onError handles
    // it; swallow so the rejection doesn't bubble up as unhandled.
    forgotPassword({ variables: { input: { email } } }).catch(() => {});

  return (
    <AuthFormContainer title="Forgot password" icon={Lock}>
      <form noValidate className="flex flex-col gap-sm" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
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
          <Link href={getLoginUrl(searchParams.get(PARAM_AUTH_REDIRECT_TO) ?? undefined)}>Already have an account? Login</Link>
          <Link href={getRegisterUrl(searchParams.get(PARAM_AUTH_REDIRECT_TO) ?? undefined)}>Don't have an account? Register</Link>
        </div>
      </form>
    </AuthFormContainer>
  );
};
