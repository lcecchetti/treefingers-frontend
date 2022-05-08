import { Link, Text } from 'components/ui';
import clsx from 'clsx';
import { getProfileMeUrl, getProfileMyStories, getProfileMyForests } from 'lib/helper/profile';

const navData = [
  {
    'label': 'Profile',
    'href': getProfileMeUrl(),
  },
  {
    'label': 'My stories',
    'href': getProfileMyStories(),
  },
  {
    'label': 'My forests',
    'href': getProfileMyForests(),
  },
]; 

const ProfileSidebar = ({ className }) => {  
  return (
    <nav className={clsx('flex flex-col gap-sm my-sm lg:my-md', className)}>
      <ul className="flex-col gap-px bg-primary-contrast text-primary-contrast rounded-xl overflow-hidden">
        {navData.map((item, index) => (
          <li key={index} className="border-b border-primary-contrast bg-primary relative">
            <Link href={item.href} className="py-sm px-md flex items-center gap-sm">
              <Text variant="span" className="uppercase my-xs font-bold text-sm">{item.label}</Text>
              {item.Icon &&
                <item.Icon className="text-xl" />
              }
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ProfileSidebar; 