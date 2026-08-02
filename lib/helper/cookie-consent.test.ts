import { describe, it, expect } from 'vitest';
import { COOKIE_CONSENT_NAME, COOKIE_CONSENT_ACCEPTED, COOKIE_CONSENT_DECLINED } from './cookie-consent';

describe('cookie consent constants', () => {
  it('exposes the expected cookie name and string values', () => {
    expect(COOKIE_CONSENT_NAME).toBe('cookie-consent');
    expect(COOKIE_CONSENT_ACCEPTED).toBe('accepted');
    expect(COOKIE_CONSENT_DECLINED).toBe('declined');
  });
});
