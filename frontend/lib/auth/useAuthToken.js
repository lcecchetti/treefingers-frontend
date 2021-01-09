import { useCookies } from 'react-cookie';

const useAuthToken = () => {

  // use cookies
  const [cookies, setCookie, removeCookie] = useCookies([process.env.NEXT_PUBLIC_AUTH_TOKEN]);

  // auth token
  const authToken = cookies[process.env.NEXT_PUBLIC_AUTH_TOKEN];

  // set token
  const setAuthToken = (authToken) => setCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN, authToken);

  // remove token
  const removeAuthToken = () => removeCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN);

  return { authToken, setAuthToken, removeAuthToken };
};

export default useAuthToken;