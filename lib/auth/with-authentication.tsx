'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLoginUrl } from '@/lib/helper/auth';
import { useCurrentUser } from '@/lib/auth/current-user';
import { Spinner, Container } from '@/components/ui';
import * as analytics from '@/lib/analytics';
import type { ReactNode } from 'react';

interface WithAuthenticationProps {
  children: ReactNode;
}

export const WithAuthentication = ({ children }: WithAuthenticationProps) => {
  const { currentUser, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      // redirect to login
      analytics.event({
        action: 'redirect-unauthenticated',
        category: 'auth',
      });
      router.replace(getLoginUrl());
    }
  }, [!currentUser, loading]);

  if (!currentUser) {
    // fluid/className below are explicit: Container/Spinner are still untyped .js, so TS infers these as required
    return (
      <Container className="flex gap-sm pt-header min-h-screen items-center justify-center" fluid={false}>
        <Spinner label="Authenticating..." className="" />
      </Container>
    );
  }

  return <>{children}</>;
};
