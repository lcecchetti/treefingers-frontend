import { describe, it, expect } from 'vitest';
import { getUserUrl, getAuthorsUrl } from './user';

describe('user helpers', () => {
  it('getUserUrl builds a user path from their username', () => {
    expect(getUserUrl({ username: 'lucac' })).toBe('/user/lucac');
  });

  it('getAuthorsUrl returns the authors listing path', () => {
    expect(getAuthorsUrl()).toBe('/authors');
  });
});
