import { Link, Button, Text } from 'components/ui';
import { Avatar } from 'components/user';
import clsx from 'clsx';
import { Card, CardBody, CardHeader } from 'components/common';
import { getUserUrl, type UserRef } from 'lib/helper/user';
import UserFollowership, { type UserFollowershipUser } from '../UserFollowership';

interface UserCardUser extends UserRef, UserFollowershipUser {
  excerpt: string;
}

interface UserCardProps {
  className?: string;
  user: UserCardUser;
}

const UserCard = ({ className, user }: UserCardProps) => {
  return (
    <Card className={clsx('bg-primary text-primary-contrast', className)}>
      <CardHeader>
        <Avatar className="justify-end" user={user} showName={true} />
        <UserFollowership user={user} />
      </CardHeader>

      <CardBody>
        <Text className="break-words w-full text-center">{user.excerpt}</Text>
        <Button as={Link} href={getUserUrl(user)} variant="primary-contrast">View profile</Button>
      </CardBody>
    </Card>
  );
};

export default UserCard;
