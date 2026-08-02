import { describe, it, expect } from 'vitest';
import { getSearchUrl } from './search';

describe('getSearchUrl', () => {
  it('returns the bare search path with no query', () => {
    expect(getSearchUrl()).toBe('/search');
  });

  it('appends the query as-is when provided', () => {
    expect(getSearchUrl('dragons')).toBe('/search?q=dragons');
  });
});
