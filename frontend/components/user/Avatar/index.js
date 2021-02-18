import { MdAccountCircle } from 'react-icons/md';
import { Link, Text } from 'components/ui';
import clsx from 'clsx';
import { getAuthorUrl } from 'lib/helper';

const Avatar = ({ className, user, size = 'md', showName = false }) => {
  return (
    <Link href={getAuthorUrl(user)} underline={false} className={clsx('flex items-center', className, {
      ['text-sm gap-xs']: size === 'sm',
      ['text-md gap-xs']: size === 'md',
      ['text-lg gap-sm']: size === 'lg',
    })}>
      <MdAccountCircle className={clsx({
        ['text-2xl']: size === 'sm',
        ['text-4xl']: size === 'md',
        ['text-5xl']: size === 'lg',
      })} />
      {showName && 
        <Text variant="span">{user.username}</Text>
      }
    </Link>
  );
};

export default Avatar;