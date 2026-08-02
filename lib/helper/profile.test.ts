import { describe, it, expect } from 'vitest';
import {
  getProfileMeUrl,
  getProfileDetailsUrl,
  getProfileMyStories,
  getProfileMyForests,
  getProfileMyChapters,
  getProfileLikedStories,
  getProfileLikedChapters,
  getProfileFollowedUsers,
  getProfileJoinedForests,
} from './profile';

describe('profile url helpers', () => {
  it.each([
    [getProfileMeUrl, '/profile/me'],
    [getProfileDetailsUrl, '/profile/details'],
    [getProfileMyStories, '/profile/my-stories'],
    [getProfileMyForests, '/profile/my-forests'],
    [getProfileMyChapters, '/profile/my-chapters'],
    [getProfileLikedStories, '/profile/liked-stories'],
    [getProfileLikedChapters, '/profile/liked-chapters'],
    [getProfileFollowedUsers, '/profile/followed-users'],
    [getProfileJoinedForests, '/profile/joined-forests'],
  ])('%p returns %s', (fn, expected) => {
    expect(fn()).toBe(expected);
  });
});
