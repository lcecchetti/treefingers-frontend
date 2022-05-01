/**
 * @type {string} - redirec to this page after login/registe
 */
const PARAM_AUTH_REDIRECT_TO = 'redirect';

/**
 * Get login url
 * @param {string} redirect - redirect to this url after action
 * @return {string}
 */
const getLoginUrl = (redirect) => {
  let url = '/auth/login';

  if (redirect) {
    url += `?${PARAM_AUTH_REDIRECT_TO}=${redirect}`
  }

  return url;
};

/**
 * Get logout url
 * @return {string}
 */
const getLogoutUrl = () => {
  return '/auth/logout';
};

/**
 * Get recover password url
 * @param {string} redirect - redirect to this url after action
 * @return {string}
 */
const getRecoverPasswordUrl = (redirect) => {
  let url = '/auth/recover-password';

  if (redirect) {
    url += `?${PARAM_AUTH_REDIRECT_TO}=${redirect}`
  }
  return url;
};

/**
 * Get register url
 * @param {string} redirect - redirect to this url after action
 * @return {string}
 */
const getRegisterUrl = (redirect) => {
  let url = '/auth/register';

  if (redirect) {
    url += `?${PARAM_AUTH_REDIRECT_TO}=${redirect}`
  }

  return url;
};

export { getLoginUrl, getLogoutUrl, getRegisterUrl, getRecoverPasswordUrl, PARAM_AUTH_REDIRECT_TO };