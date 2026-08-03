'use client';

import { Text } from '@/components/ui';
import { useSuspenseQuery } from '@apollo/client/react';
import { StoryList } from '@/components/story';
import { ApiError, PageIntro } from '@/components/common';
import { UserFollowership } from '@/components/user/user-followership';
import { useCurrentUser } from '@/lib/auth/current-user';
import { QUERY_USER } from './user-view.query';

interface UserViewProps {
  className?: string;
  user: { id: string };
}

export const UserView = ({ className, user }: UserViewProps) => {
  const { currentUser } = useCurrentUser();

  const { data, error } = useSuspenseQuery(QUERY_USER, {
    variables: { filter: { id: { eq: user.id } } },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    errorPolicy: 'all',
  });

  return (
    <div className={className}>
      <ApiError error={error ?? false}/>

      {data?.user &&
        <>
          <PageIntro>
            <div className="flex justify-between items-center">
              <Text variant="pageTitle" className="whitespace-pre-wrap w-full break-words">{data.user.username}</Text>
              <UserFollowership user={data.user} />
            </div>
            <Text variant="p" className="break-words w-full">{data.user.bio}</Text>
          </PageIntro>
          <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" filter={{ author: { eq: data.user.id }, parent: { eq: null } }} sort={{ likesCount:'DESC' }} setTotalCount={undefined} />
        </>
      }
    </div>
  );
};
