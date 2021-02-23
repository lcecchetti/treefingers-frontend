import { useEffect } from 'react';
import { useRouter} from 'next/router';
import { useApolloClient } from '@apollo/client';
import { removeAuthToken } from 'lib/auth/token';

const Logout = () => {
  const router = useRouter()
  const client = useApolloClient();

  const logout = async () => {
    removeAuthToken();

    await client.resetStore();

    router.push('/');
  };

  useEffect(() => {
    logout();
  })

  return <p>Logging out...</p>
};

export default Logout;