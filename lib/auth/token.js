import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const authCookieOptions = { path: '/' };

/**
 * Get auth token
 * @return {string}
 */
const getAuthToken = () => {
  return cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN);
}

/**
 * Set auth token
 * @param {string} authToken 
 */
const setAuthToken = (authToken) => {
  cookies.set(process.env.NEXT_PUBLIC_AUTH_TOKEN, authToken, authCookieOptions);
}

/**
 * Remove auth token
 */
const removeAuthToken = () => {
  cookies.remove(process.env.NEXT_PUBLIC_AUTH_TOKEN, authCookieOptions);
}

export { setAuthToken, getAuthToken, removeAuthToken };