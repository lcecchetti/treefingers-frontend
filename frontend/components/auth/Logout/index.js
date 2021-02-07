import { useEffect } from 'react';
import useAuthToken from 'lib/auth/useAuthToken';
import { useRouter} from 'next/router';

const Logout = () => {
  const router = useRouter()
  const { removeAuthToken } = useAuthToken();

  //@todo verify signout sync timing
  useEffect(() => {
    removeAuthToken();
    router.push('/');
  }, [router])

  return <p>Logging out...</p>
};

export default Logout;