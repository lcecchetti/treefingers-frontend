import clsx from 'clsx';
import { FaSearch, FaPenFancy, FaUserCircle, FaBars } from 'react-icons/fa';
import { Link } from 'components/ui';
import { useTheme } from 'next-themes';
import { useUI } from 'lib/ui/context';
import { getLoginUrl } from 'lib/helper/auth';
import { getProfileMeUrl } from 'lib/helper/profile';
import { getStoryNewUrl } from 'lib/helper/story';
import { ThemeIcon } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';

const IconList = () => {
  const { theme, setTheme } = useTheme();
  const { toggleDrawer, getToggledTheme, openSearch } = useUI();
  const currentUser = useCurrentUser();

  const iconListItems = [
    {
      href: '#',
      Icon: FaSearch,
      onClick: openSearch,
      showOnMobile: true,
      showOnDesktop: true,
    },
    {
      href: getStoryNewUrl(),
      Icon: FaPenFancy,
      onClick: false,
      showOnMobile: false,
      showOnDesktop: true,
    },
    {
      href: '#',
      Icon: ThemeIcon,
      onClick: () => setTheme(getToggledTheme(theme)),
      showOnMobile: false,
      showOnDesktop: true,
    },
    {
      href: currentUser ? getProfileMeUrl() : getLoginUrl(),
      Icon: FaUserCircle,
      onClick: false,
      showOnMobile: true,
      showOnDesktop: true,
    },
    {
      href: '#',
      Icon: FaBars,
      onClick: toggleDrawer,
      showOnMobile: true,
      showOnDesktop: false,
    },
  ];

  return (
    <ul className="flex flex-row gap-sm sm:gap-md">
      {iconListItems.map((item, index) => (
        <li key={index} className={clsx({
          ['hidden md:inline-block']: !item.showOnMobile,
          ['md:hidden']: !item.showOnDesktop,
        })}>
          <Link href={item.href} onClick={item.onClick ? item.onClick : undefined}>
            <item.Icon className="text-2xl" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default IconList;