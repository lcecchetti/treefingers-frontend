import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { UserFollowership } from './user-followership';
import { graphql } from '@/lib/graphql/generated';
import type { ResultOf } from '@graphql-typed-document-node/core';

// colocated with the component that owns it, per Apollo's fragment
// guidance. Unlike UserCard (fed a raw, still-masked query edge by list
// components), UserView and user/[username]/page.tsx both already have to
// unmask this fragment themselves to read username/bio directly - so
// UserContent just takes the already-unmasked, plain result type instead
// of unmasking a second time
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

// pure/hook-free so it can be rendered from either the live, personalized
// UserView (client) or a Server Component's static fallback (user/[username]
// page) using the already-fetched public user data - one markup source, no
// risk of the two drifting apart
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
