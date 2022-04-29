import { useMemo } from 'react';
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client';
import merge from 'deepmerge';
import { getAuthToken } from 'lib/auth/token';
import isEqual from 'lodash/isEqual';
import { relayStylePagination } from '@apollo/client/utilities';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient;

/**
 * Api endpoint http link
 * @type {HttpLink}
 */
const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
  credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers
});

/**
 * Authentication middleware
 * @return {ApolloLink}
 */
const authMiddleware = () =>
  new ApolloLink((operation, forward) => {

    const authToken = getAuthToken();

    // add the authorization to the headers
    operation.setContext({
      headers: {
        authorization: authToken ? `Bearer ${authToken}` : '',
      },
    });

    return forward(operation);
  });

/**
 * Create apollo client instance
 * @return {ApolloClient<NormalizedCacheObject>}
 */
function createApolloClient() {

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authMiddleware().concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            comments: relayStylePagination(['filter', 'sort']),
            stories: relayStylePagination(['filter', 'sort']),
            forests: relayStylePagination(['filter', 'sort']),
            users: relayStylePagination(['filter', 'sort']),
          }
        },
      },
    }),
  });
}

/**
 * Initialize apollo client
 * @param initialState
 * @return {ApolloClient}
 */
export function initializeApollo(initialState = null) {

  // recycle apollo client for same session
  const _apolloClient = apolloClient ?? createApolloClient();

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
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}