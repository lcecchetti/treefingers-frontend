import { getLogoutUrl } from "lib/helper/auth";

export default [
  {
    'label': 'Me',
    'href': '/profile/me',
  },
  {
    'label': 'Link 1',
    'href': '/#',
  },
  {
    'label': 'Logout',
    'href': getLogoutUrl(),
  },
];