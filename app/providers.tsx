'use client';

import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { initializeApollo } from '@/lib/apollo/client';
import { Flyout, Toasts } from '@/components/common';
import { ThemeProvider } from 'next-themes';
import { UIProvider } from '@/lib/ui/context';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const apolloClient = useMemo(() => initializeApollo(), []);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider attribute="class">
        <UIProvider>
          {children}
          <Flyout />
          <Toasts />
        </UIProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};
