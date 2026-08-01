const PARAM_AUTH_REDIRECT_TO = 'redirect';
const PARAM_AUTH_FROM = 'from';

// only allow same-site, relative paths (blocks e.g. redirect=https://evil.com or redirect=//evil.com)
const getSafeRedirect = (redirect: unknown): string | undefined => {
  return typeof redirect === 'string' && /^\/(?!\/|\\)/.test(redirect) ? redirect : undefined;
};

const getLoginUrl = (redirect?: unknown): string => {
  let url = '/auth/login';
  const safeRedirect = getSafeRedirect(redirect);

  if (safeRedirect) {
    url += `?${PARAM_AUTH_REDIRECT_TO}=${encodeURIComponent(safeRedirect)}`;
  }

  return url;
};

const getLogoutUrl = (): string => {
  return '/auth/logout';
};

const getForgotPasswordUrl = (redirect?: unknown): string => {
  let url = '/auth/forgot-password';
  const safeRedirect = getSafeRedirect(redirect);

  if (safeRedirect) {
    url += `?${PARAM_AUTH_REDIRECT_TO}=${encodeURIComponent(safeRedirect)}`;
  }
  return url;
};

const getRegisterUrl = (redirect?: unknown): string => {
  let url = '/auth/register';
  const safeRedirect = getSafeRedirect(redirect);

  if (safeRedirect) {
    url += `?${PARAM_AUTH_REDIRECT_TO}=${encodeURIComponent(safeRedirect)}`;
  }

  return url;
};

export { getLoginUrl, getLogoutUrl, getRegisterUrl, getForgotPasswordUrl, getSafeRedirect, PARAM_AUTH_REDIRECT_TO, PARAM_AUTH_FROM };
