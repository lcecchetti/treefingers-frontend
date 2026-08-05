'use client';

import { ApolloLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloNextAppProvider,
} from '@apollo/client-integration-nextjs';
import { authErrorLink, makeHttpLink, typePolicies } from '@/lib/apollo/config';
import type { ReactNode } from 'react';

// SSR + browser client factory: ApolloNextAppProvider calls this once per
// server request (and once in the browser) and manages the instance itself,
// making every 'use client' component's own useQuery/useSuspenseQuery
// correctly SSR instead of only working after browser-side hydration. This
// lives in a Client Component (not lib/apollo/client.ts) because that module
// imports the RSC-only registerApolloClient, which the client bundle lacks.
function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache({ typePolicies }),
    link: ApolloLink.from([authErrorLink, makeHttpLink()]),
  });
}

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
};
