import { ProfileLayout } from '@/components/layout';
import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { StoryList } from '@/components/story';
import Head from 'next/head';
import { useState } from 'react';
import type { NextPageWithLayout } from '@/lib/types/next';

const LikedChaptersPage: NextPageWithLayout = () => {
  const [storiesCount, setStoriesCount] = useState<number>();

  return (
    <>
      <PageIntro>
        <Head>
          <title>Liked chapters - Treefingers</title>
        </Head>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Chapters you like</Text>
        </div>
        <Text variant="p">
          Here is a list of the chapters you've liked.
        </Text>
      </PageIntro>
      {storiesCount === 0 &&
        <Text>You haven't liked any chapter yet. What are you waiting for?</Text>
      }
      <StoryList className="grid md:grid-cols-2 grid-cols-1 gap-md" filter={{ liked: true, parent: { neq: null } }} setTotalCount={setStoriesCount}/>
    </>
  );
};

LikedChaptersPage.Layout = ProfileLayout;

export default LikedChaptersPage;
