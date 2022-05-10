import { ProfileLayout } from 'components/layout';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';
import { StoryList } from 'components/story';
import { useCurrentUser } from 'lib/auth/currentUser';
import Head from 'next/head';

const ProfileMyStoriesPage = () => {
  const { currentUser } = useCurrentUser();

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
      <StoryList className="grid md:grid-cols-2 gap-md" filter={{ author: { eq: currentUser._id } }} />
    </>
  );
};

ProfileMyStoriesPage.Layout = ProfileLayout;

export default ProfileMyStoriesPage;