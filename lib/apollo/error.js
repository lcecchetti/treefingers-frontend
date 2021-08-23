//@todo refactor error management: is the issue specific to login/register mutation? apollo-link-error?
export const parseError = (error) => {
  if (error.graphQLErrors) {
    for (const graphQLError of error.graphQLErrors) {

      // check for exception message
      const exceptionError = graphQLError.extensions?.exception?.data?.message[0].messages[0];
      if (exceptionError) {
        return exceptionError.message;
      }

      // check for generic errors
      if (graphQLError.message) {
        return graphQLError.message;
      }
    }
  }

  // return generic error
  return 'An error has occurred';
};