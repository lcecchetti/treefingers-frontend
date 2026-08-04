import { ApolloLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';
import { authErrorLink, makeHttpLink, typePolicies } from '@/lib/apollo/config';

// RSC-only client: used exclusively by generateMetadata()/other Server
// Component code that needs data before any Client Component exists to read
// it. `registerApolloClient` only exists in the integration package's
// react-server build, so this module must never be pulled into a Client
// Component bundle - the SSR/browser factory lives in app/apollo-wrapper.tsx.
// Never share this client's data with the ApolloNextAppProvider client -
// they're deliberately separate instances per Apollo's own Next.js guidance.
export const { getClient, query } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({ typePolicies }),
    link: ApolloLink.from([authErrorLink, makeHttpLink()]),
  });
});

// Same as above but never reads next/headers' cookies(), so it doesn't
// force routes using it into dynamic rendering. Use this for queries that
// don't need the visitor's session (e.g. public metadata/existence checks
// on ISR-cached pages) - reach for `query` instead if a route genuinely
// needs authenticated data.
export const { query: publicQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({ typePolicies }),
    link: ApolloLink.from([authErrorLink, makeHttpLink({ forwardCookies: false })]),
  });
});
