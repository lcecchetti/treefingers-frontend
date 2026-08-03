'use client';

import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { StoryList } from '@/components/story';
import { useState } from 'react';

export default function LikedStoriesPage() {
  const [storiesCount, setStoriesCount] = useState<number>();

  return (
    <>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Stories you like</Text>
        </div>
        <Text variant="p">
          Here is a list of the stories you've liked.
        </Text>
      </PageIntro>
      {storiesCount === 0 &&
        <Text>You haven't liked any story yet. What are you waiting for?</Text>
      }
      <StoryList className="grid md:grid-cols-2 grid-cols-1 gap-md" filter={{ liked: true, parent: { eq: null } }} setTotalCount={setStoriesCount}/>
    </>
  );
}
