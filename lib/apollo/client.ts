import { useMemo } from 'react';
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import merge from 'deepmerge';
import { logoutSession } from 'lib/auth/logout';
import isEqual from 'lodash/isEqual';
import { relayStylePagination } from '@apollo/client/utilities';
import { getLoginUrl } from 'lib/helper/auth';

// these mutations validate a one-off link token of their own (password reset,
// account activation), independent of the session token, so an UNAUTHENTICATED
// error from them doesn't mean the current session is invalid
const AUTH_MUTATIONS_WITH_OWN_TOKEN = ['changePassword', 'activateAccount'];

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
  // the auth token lives in an httpOnly cookie set by the backend, sent
  // automatically; the frontend never reads or attaches it itself
  credentials: 'include',
});

// centralizes what individual components used to handle ad hoc: if the
// backend rejects the session token itself (not a permission/ownership
// error - those are FORBIDDEN, see backend), clear it and send the user
// to log in again instead of leaving them stuck on broken queries
const authErrorLink = onError(({ graphQLErrors, operation }) => {
  if (typeof window === 'undefined' || !graphQLErrors) return;
  if (AUTH_MUTATIONS_WITH_OWN_TOKEN.includes(operation.operationName)) return;

  const sessionRejected = graphQLErrors.some(
    (error) => error.extensions?.code === 'UNAUTHENTICATED'
  );

  if (!sessionRejected) return;
  if (window.location.pathname.startsWith('/auth')) return;

  logoutSession().then(() => {
    window.location.assign(getLoginUrl(window.location.pathname));
  });
});

function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([authErrorLink, httpLink]),
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

export function initializeApollo(initialState: NormalizedCacheObject | null = null): ApolloClient<NormalizedCacheObject> {
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
      arrayMerge: (destinationArray: unknown[], sourceArray: unknown[]) => [
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

export function addApolloState<P extends { props?: Record<string, unknown> }>(client: ApolloClient<NormalizedCacheObject>, pageProps: P): P {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps: Record<string, unknown>): ApolloClient<NormalizedCacheObject> {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state as NormalizedCacheObject | null), [state]);
  return store;
}
