import { Link, Button, Text } from '@/components/ui';
import { Avatar } from '@/components/user';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getUserUrl } from '@/lib/helper/user';
import { UserFollowership } from './user-followership';
import { graphql, useFragment, type FragmentType } from '@/lib/graphql/generated';

// colocated with the component that owns it - see components/forest/forest-card.tsx
// for why `useFragment` here is safe to call from either a Server or Client Component
export const UserCard_UserFragment = graphql(`
  fragment UserCard_user on User {
    id
    excerpt
    username
    followersCount
    currentUserFollowershipAsFollower {
      id
    }
  }
`);

interface UserCardProps {
  className?: string;
  user: FragmentType<typeof UserCard_UserFragment>;
}

export const UserCard = ({ className, user: userRef }: UserCardProps) => {
  const user = useFragment(UserCard_UserFragment, userRef);

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
