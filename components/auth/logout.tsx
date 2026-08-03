'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import { logoutSession } from '@/lib/auth/logout';
import { Spinner, Container } from '@/components/ui';

export const Logout = () => {
  const router = useRouter();
  const client = useApolloClient();

  const logout = async () => {
    await logoutSession();
    await client.resetStore();
    router.push('/');
  };

  useEffect(() => {
    logout();
  }, []);

  return (
    <Container className="flex gap-sm items-center justify-center">
      <Spinner label="Logging out..."/>
    </Container>
  );
};
