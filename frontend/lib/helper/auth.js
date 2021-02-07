/**
 * Get login url
 * @return {string}
 */
const getLoginUrl = () => {
  return '/auth/login';
};

/**
 * Get logout url
 * @return {string}
 */
const getLogoutUrl = () => {
  return '/auth/logout';
};

/**
 * Get register url
 * @return {string}
 */
const getRegisterUrl = () => {
  return '/auth/register';
};

export { getLoginUrl, getLogoutUrl, getRegisterUrl };