import { Link, Button, Text } from '@/components/ui';
import { Avatar } from '@/components/user';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getUserUrl, type UserRef } from '@/lib/helper/user';
import { UserFollowership, type UserFollowershipUser } from './user-followership';

interface UserCardUser extends UserRef, UserFollowershipUser {
  excerpt: string;
}

interface UserCardProps {
  className?: string;
  user: UserCardUser;
}

export const UserCard = ({ className, user }: UserCardProps) => {
  return (
    <Card className={cn('bg-primary text-primary-contrast', className)}>
      <CardHeader>
        <Avatar className="justify-end" size="sm" user={user} showName={true} />
        <UserFollowership user={user} />
      </CardHeader>

      <CardContent>
        <Text className="break-words w-full text-center">{user.excerpt}</Text>
        <Button as={Link} href={getUserUrl(user)} variant="primary-contrast">View profile</Button>
      </CardContent>
    </Card>
  );
};
