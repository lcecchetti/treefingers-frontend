import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const authCookieOptions = { path: '/' };
const authCookieName = 'token';

const getAuthToken = () => {
  return cookies.get(authCookieName);
}

const setAuthToken = (authToken) => {
  cookies.set(authCookieName, authToken, authCookieOptions);
}

const removeAuthToken = () => {
  cookies.remove(authCookieName, authCookieOptions);
}

export { setAuthToken, getAuthToken, removeAuthToken };