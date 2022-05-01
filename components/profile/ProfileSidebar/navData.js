import { getProfileMeUrl, getProfileMyStories, getProfileMyForests } from 'lib/helper/profile';

export default [
  {
    'label': 'Profile',
    'href': getProfileMeUrl(),
  },
  {
    'label': 'My stories',
    'href': getProfileMyStories(),
  },
  {
    'label': 'My forests',
    'href': getProfileMyForests(),
  },
]; 