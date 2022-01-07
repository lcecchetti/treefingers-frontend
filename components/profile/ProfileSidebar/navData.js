import { getProfileMeUrl, getProfileStoriesUrl } from 'lib/helper/profile';
import { getLogoutUrl } from 'lib/helper/auth';
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