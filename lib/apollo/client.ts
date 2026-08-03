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
