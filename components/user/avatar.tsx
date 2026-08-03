import { CircleUserRound } from 'lucide-react';
import { Link, Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import { getUserUrl, type UserRef } from '@/lib/helper/user';

interface AvatarProps {
  className?: string;
  user: UserRef;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export const Avatar = ({ className, user, size = 'md', showName = false }: AvatarProps) => {
  return (
    <Link href={getUserUrl(user)} className={cn('flex items-center', className, {
      ['text-sm gap-xs']: size === 'sm',
      ['text-md gap-xs']: size === 'md',
      ['text-lg gap-sm']: size === 'lg',
    })}>
      <CircleUserRound className={cn({
        ['w-6 h-6']: size === 'sm',
        ['w-9 h-9']: size === 'md',
        ['w-12 h-12']: size === 'lg',
      })} />
      {showName &&
        <Text variant="span" className="break-words max-w-full">{user.username}</Text>
      }
    </Link>
  );
};
