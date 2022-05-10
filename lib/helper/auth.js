const PARAM_AUTH_REDIRECT_TO = 'redirect';
const PARAM_AUTH_FROM = 'from';

const getLoginUrl = (redirect) => {
  let url = '/auth/login';

  if (redirect) {
    url += `?${PARAM_AUTH_REDIRECT_TO}=${redirect}`
  }

  return url;
};

const getLogoutUrl = () => {
  return '/auth/logout';
};

const getForgotPasswordUrl = (redirect) => {
  let url = '/auth/forgot-password';

  if (redirect) {
    url += `?${PARAM_AUTH_REDIRECT_TO}=${redirect}`
  }
  return url;
};

const getRegisterUrl = (redirect) => {
  let url = '/auth/register';

  if (redirect) {
    url += `?${PARAM_AUTH_REDIRECT_TO}=${redirect}`
  }

  return url;
};

export { getLoginUrl, getLogoutUrl, getRegisterUrl, getForgotPasswordUrl, PARAM_AUTH_REDIRECT_TO, PARAM_AUTH_FROM };