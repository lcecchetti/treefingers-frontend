import clsx from 'clsx';
import { gql, useQuery } from '@apollo/client';
import { FaSearch, FaPenFancy, FaUserCircle, FaBars } from 'react-icons/fa';
import { Link } from 'components/ui';
import { useTheme } from 'next-themes';
import { useUI } from 'lib/ui/context';
import { getLoginUrl } from 'lib/helper/auth';
import { getProfileMeUrl } from 'lib/helper/profile';
import { ThemeIcon } from 'components/common';
import { getStoryNewUrl } from 'lib/helper/story';

/**
 * Self query
 * @type {gql}
 */
const QUERY_SELF = gql`
  query self {
    self {
      id
      username
    }
  }
`;

const IconList = () => {
  const { theme, setTheme } = useTheme();
  const { toggleDrawer, getToggledTheme } = useUI();
  const { data } = useQuery(QUERY_SELF);

  const iconListItems = [
    {
      href: '#',
      Icon: FaSearch,
      onClick: false,
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
      href: data ? getProfileMeUrl() : getLoginUrl(),
      Icon: FaUserCircle,
      onClick: false,
      showOnMobile: true,
      showOnDesktop: true,
    },
    {
      href: '#',
      Icon: FaBars,
      onClick: () => toggleDrawer(),
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