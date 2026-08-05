'use client';

import { ApolloProvider } from './apollo-provider';
import { Flyout, Toasts } from '@/components/common';
import { ThemeProvider } from 'next-themes';
import { UIProvider } from '@/lib/ui/context';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ApolloProvider>
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
