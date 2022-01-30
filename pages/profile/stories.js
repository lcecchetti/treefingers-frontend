import { ProfileLayout } from 'components/layout';
import { useCurrentUser } from 'lib/auth/currentUser';
import { StoryList } from 'components/story';
import { PageIntro } from 'components/common';
import { Text } from 'components/ui';

const ProfileStoriesPage = () => {
  const currentUser = useCurrentUser();

  return (
    <>
      <PageIntro>
        <Text variant="pageTitle">My stories</Text>
        <Text variant="p">Here you can find a list of all your writings.</Text>
      </PageIntro>
      <StoryList filter={{ author: { eq: currentUser._id } }} />
    </>
  );
};

ProfileStoriesPage.Layout = ProfileLayout;

export default ProfileStoriesPage;