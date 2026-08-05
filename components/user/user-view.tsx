'use client';

import { useSuspenseQuery } from '@apollo/client/react';
import { StoryList } from '@/components/story';
import { ApiError } from '@/components/common';
import { useCurrentUser } from '@/lib/auth/current-user';
import { UserContent, UserContent_UserFragment } from './user-content';
import { QUERY_USER } from './user-view.query';
import { useFragment } from '@/lib/graphql/generated';

interface UserViewProps {
  className?: string;
  userId: string;
}

export const UserView = ({ className, userId }: UserViewProps) => {
  const { currentUser } = useCurrentUser();

  const { data, error } = useSuspenseQuery(QUERY_USER, {
    variables: { filter: { id: { eq: userId } } },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    errorPolicy: 'all',
  });

  const user = useFragment(UserContent_UserFragment, data?.user);

  return (
    <div className={className}>
      <ApiError error={error ?? false}/>

      {user &&
        <>
          <UserContent user={user} />
          <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" filter={{ author: { eq: user.id }, parent: { eq: null } }} sort={{ likesCount:'DESC' }} setTotalCount={undefined} />
        </>
      }
    </div>
  );
};
