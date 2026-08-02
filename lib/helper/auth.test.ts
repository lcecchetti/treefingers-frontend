import { describe, it, expect } from 'vitest';
import { getSafeRedirect, getLoginUrl, getLogoutUrl, getForgotPasswordUrl, getRegisterUrl, PARAM_AUTH_REDIRECT_TO } from './auth';

describe('getSafeRedirect', () => {
  it('allows a relative same-site path', () => {
    expect(getSafeRedirect('/profile/me')).toBe('/profile/me');
  });

  it('rejects a protocol-relative path (blocks //evil.com)', () => {
    expect(getSafeRedirect('//evil.com')).toBeUndefined();
  });

  it('rejects an absolute external URL', () => {
    expect(getSafeRedirect('https://evil.com')).toBeUndefined();
  });

  it('rejects a backslash-prefixed path', () => {
    expect(getSafeRedirect('/\\evil.com')).toBeUndefined();
  });

  it('rejects non-string input', () => {
    expect(getSafeRedirect(undefined)).toBeUndefined();
    expect(getSafeRedirect(42)).toBeUndefined();
  });
});

describe('getLoginUrl', () => {
  it('returns the bare login path with no redirect', () => {
    expect(getLoginUrl()).toBe('/auth/login');
  });

  it('appends an encoded redirect param for a safe path', () => {
    expect(getLoginUrl('/story/new')).toBe(`/auth/login?${PARAM_AUTH_REDIRECT_TO}=%2Fstory%2Fnew`);
  });

  it('omits the redirect param for an unsafe path', () => {
    expect(getLoginUrl('https://evil.com')).toBe('/auth/login');
  });
});

describe('getForgotPasswordUrl / getRegisterUrl', () => {
  it('append the redirect param the same way as getLoginUrl', () => {
    expect(getForgotPasswordUrl('/story/new')).toBe(`/auth/forgot-password?${PARAM_AUTH_REDIRECT_TO}=%2Fstory%2Fnew`);
    expect(getRegisterUrl('/story/new')).toBe(`/auth/register?${PARAM_AUTH_REDIRECT_TO}=%2Fstory%2Fnew`);
  });
});

describe('getLogoutUrl', () => {
  it('returns the logout path', () => {
    expect(getLogoutUrl()).toBe('/auth/logout');
  });
});
