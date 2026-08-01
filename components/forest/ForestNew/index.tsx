import { useMutation, type ApolloError } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField, Button } from 'components/ui';
import { getForestUrl } from 'lib/helper/forest';
import { AuthRequired } from 'components/auth';
import { ApiError } from 'components/common';
import * as gtag from 'lib/gtag';
import { useState } from 'react';
import { useUI } from 'lib/ui/context';

const MUTATION_FOREST_CREATE = graphql(`
  mutation createForest($input: CreateForestInput!) {
    createForest(input: $input) {
      forest {
        id
        name
      }
    }
  }
`);

const MUTATION_FOREST_EDIT = graphql(`
  mutation editForest($input: EditForestInput!) {
    editForest(input: $input) {
      forest {
        id
        about
      }
    }
  }
`);

const forestNameSchema = z
  .string()
  .min(1, 'Required')
  .max(21, 'Too long!')
  .regex(/^[a-zA-Z0-9-_.]+$/, 'Only letters, numbers, dots, hyphens and underscores');

// the name field is only rendered (and required) when creating a forest, since it can't be edited afterwards
const getForestNewSchema = (isEditing: boolean) => z.object({
  name: isEditing ? z.string() : forestNameSchema,
  about: z.string().min(1, 'Required').max(4096, 'Too long!'),
});

type ForestNewFormValues = z.infer<ReturnType<typeof getForestNewSchema>>;

interface ForestNewProps {
  className?: string;
  forest?: { id: string; about?: string } | null;
  callback?: (data: unknown) => void;
}

const ForestNew = ({ className, forest, callback }: ForestNewProps) => {
  const [error, setError] = useState<ApolloError | false>(false);
  const [createForest] = useMutation(MUTATION_FOREST_CREATE);
  const [editForest] = useMutation(MUTATION_FOREST_EDIT);
  const router = useRouter();
  const { showToast } = useUI();
  const isEditing = !!forest;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm<ForestNewFormValues>({
    resolver: zodResolver(getForestNewSchema(isEditing)),
    defaultValues: {
      name: '',
      about: forest?.about || '',
    },
  });

  const onSubmit = ({ name, about }: ForestNewFormValues) => {
    if (isEditing) {
      return editForest({
        variables: { input: {
          id: forest!.id,
          data: { about }}
        },
        onCompleted: (data) => {
          reset();
          gtag.event({
            action: 'edit-forest',
            category: 'forest',
            label: 'success',
          });
          showToast(`Your forest has been updated!`);
          if (callback) {
            callback(data);
          }

          setError(false);
        },
        onError: (e) => {
          gtag.event({
            action: 'edit-forest',
            category: 'forest',
            label: 'error',
          });
          setError(e);
        }
      });
    } else {
      return createForest({
        variables: { input: { data: {
          name, about
        }}},
        onCompleted: (data) => {
          reset();
          gtag.event({
            action: 'create-forest',
            category: 'forest',
            label: 'success',
          });
          showToast(`${data.createForest.forest.name} created!`);
          if (callback) {
            callback(data);
          } else {
            router.push(getForestUrl(data.createForest.forest));
          }

          setError(false);
        },
        onError: (e) => {
          gtag.event({
            action: 'create-forest',
            category: 'forest',
            label: 'error',
          });
          setError(e);
        }
      });
    }
  };

  return (
    <div className={className}>
      <AuthRequired>
        <form noValidate className="flex flex-col gap-sm" onSubmit={handleSubmit(onSubmit)}>
          {!isEditing &&
            <Controller
              name="name"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormField
                  {...field}
                  type="text"
                  label="Name"
                  hint="Only letters, numbers, dots, hyphens and underscores (It cannot be edited)"
                  error={errors.name?.message}
                  touched={touchedFields.name}
                />
              )}
            />
          }
          <Controller
            name="about"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <FormField
                {...field}
                type="textarea"
                label="About"
                hint="Introduce your forest to new joiners"
                rows={10}
                error={errors.about?.message}
                touched={touchedFields.about}
              />
            )}
          />
          <ApiError error={error} />
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="w-full mt-sm">
            {isEditing ? 'Edit' : 'Create'}
            </Button>
        </form>
      </AuthRequired>
    </div>
  );
};

export default ForestNew;
