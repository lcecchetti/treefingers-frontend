import navData from './navData';
import Link from 'next/link';
import { useUser } from 'lib/auth';

const ProfileSidebar = () => {
  const user = useUser();

  return (
    <div>
      <h6>Welcome, {user?.username}!</h6>
      <div>
        <nav>
          <ul>
            {navData.map((item, index) => (
              <li key={index}>
                <Link href={item.href}><a>{item.label}</a></Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProfileSidebar;