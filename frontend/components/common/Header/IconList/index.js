import clsx from 'clsx';
import { FaSearch, FaPenFancy, FaUserCircle, FaBars } from 'react-icons/fa';
import { Link } from 'components/ui';
import { useTheme } from 'next-themes';
import { useUI } from 'lib/ui/context';
import { getLoginUrl, getProfileMeUrl, getStoryNewUrl } from 'lib/helper';
import { ThemeIcon } from 'components/common';
import { useUser } from 'lib/auth';

const IconList = () => {
  const { theme, setTheme } = useTheme();
  const { toggleDrawer, getToggledTheme, openSearch } = useUI();
  const user = useUser();

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
      href: user ? getProfileMeUrl() : getLoginUrl(),
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