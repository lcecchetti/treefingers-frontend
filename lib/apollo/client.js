import { useMemo } from 'react';
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from '@apollo/client';
import merge from 'deepmerge';
import { getAuthToken } from 'lib/auth/token';
import isEqual from 'lodash/isEqual';
import { relayStylePagination } from '@apollo/client/utilities';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient;

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
  credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers
});

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
            notifications: relayStylePagination(['filter', 'sort']),
          }
        },
      },
    }),
  });
}

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

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}