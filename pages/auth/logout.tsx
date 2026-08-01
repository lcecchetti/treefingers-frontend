import { useEffect } from 'react';
import { DefaultLayout } from '@/components/layout';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { logoutSession } from '@/lib/auth/logout';
import { Spinner, Container } from '@/components/ui';
import Head from 'next/head';
import type { NextPageWithLayout } from '@/lib/types/next';

const LogoutPage: NextPageWithLayout = () => {
  const router = useRouter()
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
      <Head>
        <title>Logout | Treefingers</title>
      </Head>
      <Spinner label="Logging out..."/>
    </Container>
  );
};

LogoutPage.Layout = DefaultLayout;

export default LogoutPage;
