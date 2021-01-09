import { MdAccountCircle } from 'react-icons/md';
import { getImageThumbnail } from 'lib/helper/media';

const UserAvatar = ({ imageProfile, firstName, lastName }) => {

  const initials = firstName?.charAt(0) + lastName?.charAt(0);

  return (
    (imageProfile || initials) ?
      <img src={getImageThumbnail(imageProfile)}></img> : <MdAccountCircle />
  );
};

export default UserAvatar;