import { ApolloLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';
import { authErrorLink, makeHttpLink, typePolicies } from '@/lib/apollo/config';

// RSC-only client for generateMetadata()/Server Components. Must never be
// pulled into a Client Component bundle -- the browser client lives in
// providers/apollo-provider.tsx and is deliberately a separate instance.
export const { getClient, query } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({ typePolicies }),
    link: ApolloLink.from([authErrorLink, makeHttpLink()]),
  });
});

// Same as above but never reads cookies(), so it won't force dynamic
// rendering. Use for queries that don't need the visitor's session; reach
// for `query` instead when a route genuinely needs authenticated data.
//
// `publicQuery` is fine inside generateMetadata/page render. generateStaticParams
// runs at build time outside a request scope, so use `getPublicClient().query()`
// there instead -- the shortcut warns about a fresh client per call.
export const { getClient: getPublicClient, query: publicQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({ typePolicies }),
    link: ApolloLink.from([authErrorLink, makeHttpLink({ forwardCookies: false })]),
  });
});
