import { useMemo } from 'react';
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client';
import merge from 'deepmerge';
import useAuthToken from 'lib/auth/useAuthToken';
import isEqual from 'lodash/isEqual'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient;
let currentToken;

/**
 * Api endpoint http link
 * @type {HttpLink}
 */
const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/graphql`,
  credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers
});

/**
 * Authentication middleware
 * @param {string} authToken
 * @return {ApolloLink}
 */
const authMiddleware = (authToken) =>
  new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    if (authToken) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
    }

    return forward(operation);
  });

/**
 * Create apollo client instance
 * @param {string} authToken
 * @return {ApolloClient<NormalizedCacheObject>}
 */
function createApolloClient(authToken) {
  // update current token
  currentToken = authToken;

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authMiddleware(authToken).concat(httpLink),
    cache: new InMemoryCache(),
  });
}

/**
 * Initialize apollo client
 * @param initialState
 * @param authToken
 * @return {ApolloClient}
 */
export function initializeApollo(initialState = null, authToken) {

  // recycle apollo client for same session
  const _apolloClient = apolloClient && authToken == currentToken ? apolloClient : createApolloClient(authToken);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

/**
 * Add apollo state to page props, to propagate it to client side apollo client instance
 * @param {ApolloClient} client
 * @param {Object} pageProps
 * @return {Object}
 */
export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

/**
 * Use apollo hook
 * @param {Object} pageProps
 * @return {ApolloClient}
 */
export function useApollo(pageProps) {
  const  { authToken } = useAuthToken();
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state, authToken), [state, authToken]);
  return store;
}