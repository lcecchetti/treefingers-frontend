export const COOKIE_CONSENT_NAME = 'cookie-consent';

// stored as explicit strings rather than a boolean: cookie values round-trip
// through react-cookie's parsing, and relying on boolean coercion there is fragile
export const COOKIE_CONSENT_ACCEPTED = 'accepted';
export const COOKIE_CONSENT_DECLINED = 'declined';
