import clsx from 'clsx';
import { FaSearch, FaBars } from 'react-icons/fa';
import { Link } from 'components/ui';
import { useTheme } from 'next-themes';
import { useUI } from 'lib/ui/context';
import { getLoginUrl } from 'lib/helper/auth';
import { getProfileMeUrl } from 'lib/helper/profile';
import { ThemeIcon } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import * as gtag from 'lib/gtag';
import { CurrentUser } from 'components/user';

const IconList = () => {
  const { theme, setTheme } = useTheme();
  const { toggleDrawer, getToggledTheme, openSearch } = useUI();
  const { currentUser } = useCurrentUser();

  const iconListItems = [
    {
      href: '#',
      Component: FaSearch,
      onClick: openSearch,
      showOnMobile: true,
      showOnDesktop: true,
    },
    {
      href: '#',
      Component: ThemeIcon,
      onClick: () => {
        const toggledTheme = getToggledTheme(theme);
        gtag.event({
          action: 'change-theme',
          category: 'theme',
          label: toggledTheme,
        });
        setTheme(toggledTheme);
      },
      showOnMobile: false,
      showOnDesktop: true,
    },
    {
      href: currentUser ? getProfileMeUrl() : getLoginUrl(),
      Component: CurrentUser,
      onClick: false,
      showOnMobile: true,
      showOnDesktop: true,
    },
    {
      href: '#',
      Component: FaBars,
      onClick: toggleDrawer,
      showOnMobile: true,
      showOnDesktop: false,
    },
  ];

  return (
    <ul className="flex flex-row gap-sm md:gap-md">
      {iconListItems.map((item, index) => (
        <li key={index} className={clsx({
          ['hidden lg:inline-block']: !item.showOnMobile,
          ['lg:hidden']: !item.showOnDesktop,
        })}>
          <Link href={item.href} onClick={item.onClick ? item.onClick : undefined}>
            <item.Component className="text-2xl" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default IconList;