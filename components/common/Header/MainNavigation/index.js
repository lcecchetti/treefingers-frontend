import { Link, Text } from 'components/ui';
import { getForestsUrl } from 'lib/helper/forest';

const mainNavigationItems = [
  {
    href: getForestsUrl(),
    label: 'FORESTS',
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