import { ProfileLayout } from 'components/layout';
import { useCurrentUser } from 'lib/auth/currentUser';
import { StoryList } from 'components/story';
import { PageIntro } from 'components/common';
import { Text } from 'components/ui';

const ProfileStoriesPage = () => {
  const currentUser = useCurrentUser();

  return (
    <>
      <PageIntro title="My stories">
        <Text variant="p">Here you can find a list of all your writings.</Text>
      </PageIntro>
      <StoryList author={currentUser} rootsOnly={false} />
    </>
  );
};

ProfileStoriesPage.Layout = ProfileLayout;

export default ProfileStoriesPage;