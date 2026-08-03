'use client';

import { ApolloWrapper } from '@/app/apollo-wrapper';
import { Flyout, Toasts } from '@/components/common';
import { ThemeProvider } from 'next-themes';
import { UIProvider } from '@/lib/ui/context';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ApolloWrapper>
      <ThemeProvider attribute="class">
        <UIProvider>
          {children}
          <Flyout />
          <Toasts />
        </UIProvider>
      </ThemeProvider>
    </ApolloWrapper>
  );
};
