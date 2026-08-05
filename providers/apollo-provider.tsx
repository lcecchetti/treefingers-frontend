'use client';

import { ApolloLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloNextAppProvider,
} from '@apollo/client-integration-nextjs';
import { authErrorLink, makeHttpLink, typePolicies } from '@/lib/apollo/config';
import type { ReactNode } from 'react';

// SSR + browser client factory, called by ApolloNextAppProvider once per
// server request and once in the browser. Lives here, not lib/apollo/client.ts,
// because that module imports the RSC-only registerApolloClient.
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
