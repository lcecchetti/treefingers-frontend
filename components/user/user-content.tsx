import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { UserFollowership } from './user-followership';
import { graphql } from '@/lib/graphql/generated';
import type { ResultOf } from '@graphql-typed-document-node/core';

// Unlike UserCard (fed a raw, masked query edge), callers here already
// unmask this fragment themselves, so UserContent takes the plain result
// type instead of unmasking a second time.
export const UserContent_UserFragment = graphql(`
  fragment UserContent_user on User {
    id
    bio
    username
    followersCount
    currentUserFollowershipAsFollower {
      id
    }
  }
`);

interface UserContentProps {
  user: ResultOf<typeof UserContent_UserFragment>;
}

// Pure/hook-free so both the live UserView (client) and user/[username]'s
// static Server Component fallback can render it from one markup source.
export const UserContent = ({ user }: UserContentProps) => {
  return (
    <PageIntro>
      <div className="flex justify-between items-center">
        <Text variant="pageTitle" className="whitespace-pre-wrap w-full break-words">{user.username}</Text>
        <UserFollowership user={user} />
      </div>
      <Text variant="p" className="break-words w-full">{user.bio}</Text>
    </PageIntro>
  );
};
