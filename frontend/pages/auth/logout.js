import { useEffect } from 'react';
import { DefaultLayout } from 'components/layout';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { getAuthToken, removeAuthToken } from 'lib/auth';
import { Spinner, Text, Container } from 'components/ui';

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
      <Text variant="span">Logging out...</Text>
      <Spinner />
    </Container>
  );
};

LogoutPage.Layout = DefaultLayout;

export default LogoutPage;