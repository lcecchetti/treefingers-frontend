import clsx from 'clsx';
import { Text } from 'components/ui';

const ApiError = ({ className, error }) => {
  if (!error) {
    return '';
  }

  const apiErrors = [];

  if (error.graphQLErrors) {
    error.graphQLErrors.map((graphQLError) => {
      apiErrors.push(graphQLError.message);
    });
  }

  if (error.networkError) {
    apiErrors.push(networkError);
  }

  if (!apiErrors.length) {
    apiErrors.push('An error has occurred');
  }

  return (
    <ul className={clsx('flex flex-col gap-sm', className)}>
      {apiErrors.map((apiError, index) => (
        <li key={index}>
          <Text variant="error">{apiError}</Text>
        </li>
      ))}
    </ul>
  );
};

export default ApiError;