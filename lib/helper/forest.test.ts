import { describe, it, expect } from 'vitest';
import { getForestUrl, getForestsUrl, getForestNewUrl } from './forest';

describe('forest helpers', () => {
  it('getForestUrl builds a forest path from its name', () => {
    expect(getForestUrl({ name: 'redwood' })).toBe('/forest/redwood');
  });

  it('getForestsUrl returns the listing path', () => {
    expect(getForestsUrl()).toBe('/forests');
  });

  it('getForestNewUrl returns the creation path', () => {
    expect(getForestNewUrl()).toBe('/forest/new');
  });
});
