import { Link, Text } from '@/components/ui';
import { getAboutUrl } from '@/lib/helper/content';
import { getForestsUrl } from '@/lib/helper/forest';
import { getStoriesUrl } from '@/lib/helper/story';
import { getAuthorsUrl } from '@/lib/helper/user';

const mainNavigationItems = [
  {
    href: getForestsUrl(),
    label: 'FORESTS',
  },
  {
    href: getStoriesUrl(),
    label: 'STORIES',
  },
  {
    href: getAuthorsUrl(),
    label: 'AUTHORS',
  },
  {
    href: getAboutUrl(),
    label: 'ABOUT',
  },
];

export const MainNavigation = () => {

  return (
    <ul className="hidden lg:flex flex-row gap-lg">
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
