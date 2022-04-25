import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const authCookieOptions = { path: '/' };
const authCookieName = 'token';

/**
 * Get auth token
 * @return {string}
 */
const getAuthToken = () => {
  return cookies.get(authCookieName);
}

/**
 * Set auth token
 * @param {string} authToken 
 */
const setAuthToken = (authToken) => {
  cookies.set(authCookieName, authToken, authCookieOptions);
}

/**
 * Remove auth token
 */
const removeAuthToken = () => {
  cookies.remove(authCookieName, authCookieOptions);
}

export { setAuthToken, getAuthToken, removeAuthToken };