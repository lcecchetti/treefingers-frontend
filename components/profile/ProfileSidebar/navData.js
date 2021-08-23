import { getLogoutUrl, getProfileMeUrl, getProfileStoriesUrl } from 'lib/helper';
import { FaSignOutAlt } from 'react-icons/fa';

export default [
  {
    'label': 'My profile',
    'href': getProfileMeUrl(),
  },
  {
    'label': 'My stories',
    'href': getProfileStoriesUrl(),
  },
  {
    'label': 'Liked stories',
    'href': '/#',
  },
  {
    'label': 'Favorite authors',
    'href': '/#',
  },
  {
    'label': 'Logout',
    'href': getLogoutUrl(),
    'Icon': FaSignOutAlt
  },
];