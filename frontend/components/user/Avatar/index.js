import { MdAccountCircle } from 'react-icons/md';

const Avatar = ({ firstName, lastName }) => {

  const initials = firstName?.charAt(0) + lastName?.charAt(0);

  return (
    <MdAccountCircle />
  );
};

export default Avatar;