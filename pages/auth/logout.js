import { useEffect } from 'react';
import { DefaultLayout } from 'components/layout';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { getAuthToken, removeAuthToken } from 'lib/auth/token';
import { Spinner, Container } from 'components/ui';

const LogoutPage = () => {
  const router = useRouter()
  const client = useApolloClient();

  const logout = async () => {
    removeAuthToken();
    await client.resetStore();
    router.push('/');
  };

  useEffect(() => {
    logout();
  }, [getAuthToken]);

  return (
    <Container className="flex gap-sm items-center justify-center">
      <Spinner label="Logging out..."/>
    </Container>
  );
};

LogoutPage.Layout = DefaultLayout;

export default LogoutPage;