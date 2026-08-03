import type { ErrorLike } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui';

export interface ApiErrorProps {
  error: ErrorLike | false;
  className?: string;
}

export const ApiError = ({ className, error }: ApiErrorProps) => {
  if (!error) {
    return '';
  }

  const apiErrors = CombinedGraphQLErrors.is(error)
    ? error.errors.map((graphQLError) => graphQLError.message)
    : [error.message];

  return (
    <ul className={cn('flex flex-col gap-sm', className)}>
      {apiErrors.map((apiError, index) => (
        <li key={index}>
          <Text variant="error">{apiError}</Text>
        </li>
      ))}
    </ul>
  );
};
