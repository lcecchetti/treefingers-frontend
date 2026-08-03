import { ApolloError } from '@apollo/client';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui';

export interface ApiErrorProps {
  error: ApolloError | false;
  className?: string;
}

export const ApiError = ({ className, error }: ApiErrorProps) => {
  if (!error) {
    return '';
  }

  const apiErrors = [];

  // graphql errors
  if (error.message) {
    apiErrors.push(error.message);
  } else if (error.graphQLErrors) {
    error.graphQLErrors.map((graphQLError) => {
      apiErrors.push(graphQLError.message);
    });
  } else if (error.networkError) {
    // network error
    apiErrors.push(error.networkError.message);
  } else {
    apiErrors.push('An error has occurred');
  }

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
