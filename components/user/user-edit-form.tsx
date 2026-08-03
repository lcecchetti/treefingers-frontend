'use client';

import { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { graphql } from '@/lib/graphql/generated';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Text, Button, FormField, Spinner } from '@/components/ui';
import { ApiError } from '@/components/common';
import { useCurrentUser } from '@/lib/auth/current-user';
import { QUERY_USER } from '@/components/user';
import * as analytics from '@/lib/analytics';

const MUTATION_EDIT_USER = graphql(`
  mutation editUser($input: EditUserInput!) {
    editUser(input: $input) {
      user {
        id
        bio
      }
    }
  }
`);

const userEditSchema = z.object({
  password: z.union([z.literal(''), z.string().min(10, 'Too short!')]),
  confirmPassword: z.string(),
  bio: z.string().max(255, 'Too long!'),
}).refine((data) => data.confirmPassword === data.password, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

type UserEditFormValues = z.infer<typeof userEditSchema>;

export const UserEditForm = () => {
  const { currentUser } = useCurrentUser();
  const [editUser, { data: editData, error: editError }] = useMutation(MUTATION_EDIT_USER, {
    onCompleted: () => {
      analytics.event({
        action: 'edit-user',
        category: 'user',
        label: 'success',
      });
    },
    onError: () => {
      analytics.event({
        action: 'edit-user',
        category: 'user',
        label: 'error',
      });
    }
  });
  const { data, loading, error } = useQuery(QUERY_USER, { variables: { filter: { id: { eq: currentUser?.id } } }, skip: !currentUser });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      bio: data?.user?.bio ?? '',
    },
  });

  useEffect(() => {
    if (data?.user) {
      reset({ password: '', confirmPassword: '', bio: data.user.bio ?? '' });
    }
  }, [data?.user?.bio]);

  const onSubmit = ({ confirmPassword, password, ...values }: UserEditFormValues) =>
    // Apollo v4's execute promise rejects on error even when onError handles
    // it; swallow so the rejection doesn't bubble up as unhandled.
    editUser({ variables: { input: { data: password ? { ...values, password } : values } } }).catch(() => {});

  return (
    <div className="flex flex-col gap-md">
      <ApiError error={error ?? false}/>
      <Spinner loading={loading}/>
      {data?.user &&
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
          <Controller
            name="bio"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormField
                {...field}
                label="Bio"
                type="textarea"
                rows={5}
                error={errors.bio?.message}
                touched={touchedFields.bio}
              />
            )}
          />
          <ApiError error={editError ?? false}/>
          {!!editData?.editUser.user &&
            <Text className="text-success">Successfully updated!</Text>
          }
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="my-sm w-full">
            Edit profile
          </Button>
        </form>
      }
    </div>
  );
};
