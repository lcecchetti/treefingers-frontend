import { describe, it, expect } from 'vitest';
import { getStoryUrl, getStoriesUrl, getStoryNewUrl, isStoryRoot } from './story';

describe('story helpers', () => {
  it('getStoryUrl builds a story path from its id', () => {
    expect(getStoryUrl({ id: 'abc123' })).toBe('/story/abc123');
  });

  it('getStoriesUrl returns the listing path', () => {
    expect(getStoriesUrl()).toBe('/stories');
  });

  it('getStoryNewUrl returns the bare creation path with no forest', () => {
    expect(getStoryNewUrl()).toBe('/story/new');
  });

  it('getStoryNewUrl appends the forest id when given', () => {
    expect(getStoryNewUrl({ id: 'forest-1' })).toBe('/story/new?forest=forest-1');
  });

  it('isStoryRoot is true when the story has no parent', () => {
    expect(isStoryRoot({ id: '1' })).toBe(true);
    expect(isStoryRoot({ id: '1', parent: undefined })).toBe(true);
  });

  it('isStoryRoot is false when the story has a parent', () => {
    expect(isStoryRoot({ id: '2', parent: { id: '1' } })).toBe(false);
  });
});
