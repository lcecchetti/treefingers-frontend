import navData from './navData';
import { Link, Text } from 'components/ui';
import { useUser } from 'lib/auth';
import clsx from 'clsx';

const ProfileSidebar = ({ className }) => {
  const user = useUser();

  return (
    <div className={clsx('flex flex-col gap-sm', className)}>
      <Text variant="h2">Welcome, {user?.username}!</Text>
      <nav className="rounded-xl bg-primary text-primary-contrast p-md">
        <ul className="flex-col gap-sm">
          {navData.map((item, index) => (
            <li key={index} className="border-primary-contrast">
              <Link href={item.href}><a>{item.label}</a></Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>

  );
};

export default ProfileSidebar;