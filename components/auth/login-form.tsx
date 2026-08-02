import { useEffect, useRef, useState } from 'react';
import { useMutation, useApolloClient, type ApolloError } from '@apollo/client';
import { graphql } from '@/lib/graphql/generated';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/lib/auth/current-user';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, FormField, Button, Text } from '@/components/ui';
import { MdLockOutline } from 'react-icons/md';
import { getForgotPasswordUrl, getRegisterUrl, getSafeRedirect, PARAM_AUTH_REDIRECT_TO } from '@/lib/helper/auth';
import { getProfileMeUrl } from '@/lib/helper/profile';
import { ApiError } from '@/components/common';
import { AuthFormContainer } from './auth-form-container';
import * as gtag from '@/lib/gtag';
import { useUI } from '@/lib/ui/context';

const MUTATION_LOGIN = graphql(`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      currentUser {
        id
        username
      }
    }
  }
`);

const MUTATION_RESEND_ACTIVATE_ACCOUNT = graphql(`
  mutation resendActivateAccount($input: ResendActivateAccountInput!) {
    resendActivateAccount(input: $input) {
      result
    }
  }
`);

const loginSchema = z.object({
  email: z.string().min(1, 'Required').regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'),
  password: z.string().min(1, 'Required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const client = useApolloClient();
  const [error, setError] = useState<ApolloError | false>(false);
  const [resendActivateAccountTo, setResendActivateAccountTo] = useState<string | false>(false);
  const { currentUser } = useCurrentUser();
  const { showToast } = useUI();
  const justLoggedInRef = useRef(false);

  const [login] = useMutation(MUTATION_LOGIN, {
    onCompleted: async ({ login }) => {
      justLoggedInRef.current = true;
      setResendActivateAccountTo(false);
      // the backend already set the auth cookie via Set-Cookie on this response
      await client.resetStore();
      gtag.event({
        action: 'login',
        category: 'auth',
        label: 'success',
      });
      const redirect = getSafeRedirect(router.query[PARAM_AUTH_REDIRECT_TO] as string | undefined) ?? '/';
      showToast(`Hey ${login.currentUser.username}, welcome!`);
      router.push(redirect);
    },
  });

  const [resendActivateAccount] = useMutation(MUTATION_RESEND_ACTIVATE_ACCOUNT, {
    onCompleted: async () => {
      gtag.event({
        action: 'resend-activate-account',
        category: 'auth',
        label: 'success',
      });
      showToast(`We got you, check your emails`);
      setResendActivateAccountTo(false);
      setError(false);
    },
    onError: (e) => {
      gtag.event({
        action: 'resend-activate-account',
        category: 'auth',
        label: 'error',
      });
      setError(e);
    }
  });

  // logged in users should not visit login/register page - skipped if we just
  // logged in via this form, since onCompleted above already redirects (and
  // respects ?redirect=); without this guard both pushes race and the landing
  // page becomes nondeterministic
  useEffect(() => {
    if (currentUser && !justLoggedInRef.current) {
      router.push(getProfileMeUrl());
    }
  }, [!currentUser]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = ({ email, password }: LoginFormValues) =>
    login({
      variables: { input: { email, password } },
      onError: (e) => {
        gtag.event({
          action: 'login',
          category: 'auth',
          label: 'error',
        });
        setError(e);
        if (e.graphQLErrors && e.graphQLErrors.length && e.graphQLErrors[0].message === 'Your account is not active yet, check your emails.') {
          setResendActivateAccountTo(email);
        }
      },
    });

  return (
    <AuthFormContainer title="Login" icon={MdLockOutline}>
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
        <Controller
          name="password"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <FormField
              {...field}
              type="password"
              label="Password"
              autoComplete="current-password"
              error={errors.password?.message}
              touched={touchedFields.password}
            />
          )}
        />
        <ApiError error={error} />
        {!!error && resendActivateAccountTo &&
          <div className="flex mb-sm items-center">
            <Text className="text-sm">Lost your activation email? No problem, we'll resend it.</Text>
            <Button type="button" onClick={() => {
              resendActivateAccountTo &&
              resendActivateAccount({ variables: { input: { email: resendActivateAccountTo } } })}}>
              Send
            </Button>
          </div>
        }
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className="w-full">
          Login
        </Button>
        <div className="flex flex-col gap-xs text-xs">
          <Link href={getForgotPasswordUrl(router.query[PARAM_AUTH_REDIRECT_TO] as string | undefined)}>Forgot password?</Link>
          <Link href={getRegisterUrl(router.query[PARAM_AUTH_REDIRECT_TO] as string | undefined)}>Don't have an account? Register</Link>
        </div>
      </form>
    </AuthFormContainer>
  );
};
