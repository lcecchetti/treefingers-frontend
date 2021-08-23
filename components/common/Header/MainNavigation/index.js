import { Link, Text } from 'components/ui';
import { getStoriesUrl, getAuthorsUrl } from 'lib/helper';

const mainNavigationItems = [
  {
    href: getStoriesUrl(),
    label: 'STORIES',
  },
  {
    href: getAuthorsUrl(),
    label: 'AUTHORS',
  },
];

const MainNavigation = () => {

  return (
    <ul className="hidden md:flex flex-row gap-xl">
      {mainNavigationItems.map((item, index) => (
        <li key={index}>
          <Link href={item.href}>
            <Text variant="span" className="font-bold text-lg">{item.label}</Text>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MainNavigation;