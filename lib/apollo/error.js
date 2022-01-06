//@todo refactor error management: is the issue specific to login/register mutation? apollo-link-error?
export const parseError = ({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    return graphQLErrors[0].message;
  }

  if (networkError) {
    return networkError;
  }

  // return generic error
  return 'An error has occurred';
};