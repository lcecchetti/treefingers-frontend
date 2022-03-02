import { getProfileMeUrl } from 'lib/helper/profile';
import { getLogoutUrl } from 'lib/helper/auth';
import { FaSignOutAlt } from 'react-icons/fa';

export default [
  {
    'label': 'My profile',
    'href': getProfileMeUrl(),
  },
  {
    'label': 'Logout',
    'href': getLogoutUrl(),
    'Icon': FaSignOutAlt
  },
];