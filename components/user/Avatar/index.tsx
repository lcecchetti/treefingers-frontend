import { MdAccountCircle } from 'react-icons/md';
import { Link, Text } from 'components/ui';
import clsx from 'clsx';
import { getUserUrl, type UserRef } from 'lib/helper/user';

interface AvatarProps {
  className?: string;
  user: UserRef;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const Avatar = ({ className, user, size = 'md', showName = false }: AvatarProps) => {
  return (
    <Link href={getUserUrl(user)} className={clsx('flex items-center', className, {
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
        <Text variant="span" className="break-words max-w-full">{user.username}</Text>
      }
    </Link>
  );
};

export default Avatar;
