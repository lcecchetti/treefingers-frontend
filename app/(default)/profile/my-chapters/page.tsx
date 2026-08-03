'use client';

import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { StoryList } from '@/components/story';
import { useCurrentUser } from '@/lib/auth/current-user';
import { useState } from 'react';

export default function ProfileMyChaptersPage() {
  const { currentUser } = useCurrentUser();
  const [storiesCount, setStoriesCount] = useState<number>();

  return (
    <>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">My chapters</Text>
        </div>
        <Text variant="p">
          Here is a list of the chapters you've created.
        </Text>
      </PageIntro>
      {storiesCount === 0 &&
        <Text>You haven't contributed to any story yet. What are you waiting for?</Text>
      }
      <StoryList className="grid md:grid-cols-2 grid-cols-1 gap-md" filter={{ author: { eq: currentUser!.id }, parent: { neq: null } }} setTotalCount={setStoriesCount}/>
    </>
  );
}
