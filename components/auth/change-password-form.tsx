'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField, Button } from '@/components/ui';
import { Lock } from 'lucide-react';
import { getLoginUrl } from '@/lib/helper/auth';
import { useRouter } from 'next/navigation';
import { AuthFormContainer } from './auth-form-container';
import { useMutation } from '@apollo/client/react';
import type { ErrorLike } from '@apollo/client';
import { graphql } from '@/lib/graphql/generated';
import { ApiError } from '@/components/common';
import { useState } from 'react';
import * as analytics from '@/lib/analytics';
import { useUI } from '@/lib/ui/context';

const MUTATION_CHANGE_PASSWORD = graphql(`
  mutation changePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      result
    }
  }
`);

const changePasswordSchema = z.object({
  password: z.union([z.literal(''), z.string().min(10, 'Too short!')]),
  confirmPassword: z.string(),
}).refine((data) => data.confirmPassword === data.password, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  token: string;
}

export const ChangePasswordForm = ({ token }: ChangePasswordFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<ErrorLike | false>(false);
  const { showToast } = useUI();

  const [changePassword] = useMutation(MUTATION_CHANGE_PASSWORD, {
    onCompleted() {
      analytics.event({
        action: 'change-password',
        category: 'auth',
        label: 'success',
      });
      showToast('Your password has been changed', { type: 'success' });
      router.push(getLoginUrl());
    },
    onError(e) {
      analytics.event({
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
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = ({ password }: ChangePasswordFormValues) =>
    // Apollo v4's execute promise rejects on error even when onError handles
    // it; swallow so the rejection doesn't bubble up as unhandled.
    changePassword({ variables: { input: { password, token } } }).catch(() => {});

  return (
    <AuthFormContainer title="Change password" icon={Lock}>
      <form noValidate className="flex flex-col gap-sm" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="password"
          control={control}
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
