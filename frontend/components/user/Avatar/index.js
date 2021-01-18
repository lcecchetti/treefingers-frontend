import { MdAccountCircle } from 'react-icons/md';
import { Link } from 'components/ui';

const Avatar = ({ firstName, lastName }) => {

  const initials = firstName?.charAt(0) + lastName?.charAt(0);

  return (
    <Link href="/#" className="text-xl">
      <MdAccountCircle />
    </Link>
  );
};

export default Avatar;