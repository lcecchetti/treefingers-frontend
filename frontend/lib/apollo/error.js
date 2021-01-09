//@todo refactor error management: is the issue specific to login/register mutation? apollo-link-error?
export const parseError = (error) => {
  if (error.graphQLErrors) {
    for (const graphQLError of error.graphQLErrors) {
      // check for extension errors
      const extensionMessage = graphQLError?.extensions?.exception?.data?.message[0]?.messages[0];
      if (extensionMessage) {
        return extensionMessage
      }

      // check for graphql errors
      if (graphQLError.message) {
        return graphQLError;
      }

      // return generic error
      return 'An error has occurred';
    }
  }
};