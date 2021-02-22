import { useEffect } from 'react';
import useAuthToken from 'lib/auth/useAuthToken';
import { useRouter} from 'next/router';

const Logout = () => {
  const router = useRouter()
  const { removeAuthToken } = useAuthToken();

  const logout = () => {
    removeAuthToken();
    router.push('/');
  };

  useEffect(() => {
    logout();
  })

  return <p>Logging out...</p>
};

export default Logout;