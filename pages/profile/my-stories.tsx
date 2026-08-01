import { ProfileLayout } from 'components/layout';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';
import { StoryList } from 'components/story';
import { useCurrentUser } from 'lib/auth/currentUser';
import Head from 'next/head';
import { useState } from 'react';
import type { NextPageWithLayout } from 'lib/types/next';

const ProfileMyStoriesPage: NextPageWithLayout = () => {
  const { currentUser } = useCurrentUser();
  const [storiesCount, setStoriesCount] = useState<number>();

  return (
    <>
      <PageIntro>
        <Head>
          <title>My stories - Treefingers</title>
        </Head>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">My stories</Text>
        </div>
        <Text variant="p">
          Here is a list of the stories you've created.
        </Text>
      </PageIntro>
      {storiesCount === 0 &&
        <Text>You haven't planted any story yet. What are you waiting for?</Text>
      }
      <StoryList className="grid md:grid-cols-2 grid-cols-1 gap-md" filter={{ author: { eq: currentUser!.id }, parent: { eq: null } }} setTotalCount={setStoriesCount}/>
    </>
  );
};

ProfileMyStoriesPage.Layout = ProfileLayout;

export default ProfileMyStoriesPage;
