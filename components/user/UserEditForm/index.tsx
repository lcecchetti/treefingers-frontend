import { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { Controller, useForm } from 'react-hook-form';
import { Text, Button, FormField, Spinner } from 'components/ui';
import { ApiError } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { QUERY_USER } from 'components/user';
import * as gtag from 'lib/gtag';

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

interface UserEditFormValues {
  password: string;
  confirmPassword: string;
  bio: string;
}

const UserEditForm = () => {
  const { currentUser } = useCurrentUser();
  const [editUser, { data: editData, error: editError }] = useMutation(MUTATION_EDIT_USER, {
    onCompleted: () => {
      gtag.event({
        action: 'edit-user',
        category: 'user',
        label: 'success',
      });
    },
    onError: () => {
      gtag.event({
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
    editUser({ variables: { input: { data: password ? { ...values, password } : values } } });

  return (
    <div className="flex flex-col gap-md">
      <ApiError error={error ?? false}/>
      <Spinner loading={loading}/>
      {data?.user &&
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
          <Controller
            name="bio"
            control={control}
            rules={{ maxLength: { value: 255, message: 'Too long!' } }}
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

export default UserEditForm;
