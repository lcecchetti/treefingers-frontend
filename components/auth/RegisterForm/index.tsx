import { useEffect, useState } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useMutation, type ApolloError } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { Controller, useForm } from 'react-hook-form';
import { Button, Link, FormField } from 'components/ui';
import { getLoginUrl, PARAM_AUTH_REDIRECT_TO } from 'lib/helper/auth';
import { getProfileMeUrl } from 'lib/helper/profile';
import { useCurrentUser } from 'lib/auth/currentUser';
import { ApiError } from 'components/common';
import AuthFormContainer from '../AuthFormContainer';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

const MUTATION_REGISTER = graphql(`
  mutation register($input: RegisterInput!) {
    register(input: $input) {
      result
    }
  }
`);

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  bio: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState<ApolloError | false>(false);
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      bio: '',
    },
  });

  const onSubmit = ({ confirmPassword, ...values }: RegisterFormValues) =>
    register({
      variables: { input: { data: values } },
      onCompleted: async () => {
        reset();
        gtag.event({
          action: 'register',
          category: 'auth',
          label: 'success',
        });
        showToast('Check your emails to activate your account', { duration: 0 });
        router.push(getLoginUrl());
      },
    });

  return (
    <AuthFormContainer title="Register" icon={MdAccountCircle}>
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
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              touched={touchedFields.email}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: 'Required', minLength: { value: 10, message: 'Too short!' } }}
          render={({ field: { ref, ...field } }) => (
            <FormField
              {...field}
              label="Password"
              type="password"
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
              error={errors.confirmPassword?.message}
              touched={touchedFields.confirmPassword}
            />
          )}
        />
        <Controller
          name="username"
          control={control}
          rules={{
            required: 'Required',
            minLength: { value: 3, message: 'Too short!' },
            maxLength: { value: 20, message: 'Too long!' },
            pattern: { value: /^[a-zA-Z0-9-_.]+$/, message: 'Only letters, numbers, dots, hyphens and underscores' },
          }}
          render={({ field: { ref, ...field } }) => (
            <FormField
              {...field}
              label="Username"
              type="text"
              hint="Only letters, numbers, dots, hyphens and underscores"
              error={errors.username?.message}
              touched={touchedFields.username}
            />
          )}
        />
        <Controller
          name="bio"
          control={control}
          rules={{ maxLength: { value: 4096, message: 'Too long!' } }}
          render={({ field: { ref, ...field } }) => (
            <FormField
              {...field}
              label="Bio"
              type="textarea"
              error={errors.bio?.message}
              touched={touchedFields.bio}
            />
          )}
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
          <Link href={getLoginUrl(router.query[PARAM_AUTH_REDIRECT_TO] as string | undefined)}>
            Already have an account? Login
          </Link>
        </div>
      </form>
    </AuthFormContainer>
  );
};

export default RegisterForm;
