import { ProfileLayout } from 'components/layout';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';
import { StoryList } from 'components/story';
import Head from 'next/head';
import { useState } from 'react';

const LikedStoriesPage = () => {
  const [storiesCount, setStoriesCount] = useState();

  return (
    <>
      <PageIntro>
        <Head>
          <title>Liked stories - Treefingers</title>
        </Head>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Stories you like</Text>
        </div>
        <Text variant="p">
          Here is a list of the stories you've liked.
        </Text>
      </PageIntro>
      {storiesCount === 0 &&
        <Text>You haven't planted any story yet. What are you waiting for?</Text>
      }
      <StoryList className="grid md:grid-cols-2 gap-md" filter={{ liked: true }} setTotalCount={setStoriesCount}/>
    </>
  );
};

LikedStoriesPage.Layout = ProfileLayout;

export default LikedStoriesPage;