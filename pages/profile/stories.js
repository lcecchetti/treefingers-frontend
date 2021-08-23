import { ProfileLayout } from 'components/layout';
import { useUser } from 'lib/auth';
import { StoryList } from 'components/story';
import { PageIntro } from 'components/common';
import { Text } from 'components/ui';

const ProfileStoriesPage = () => {
  const user = useUser();

  return (
    <>
      <PageIntro title="My stories">
        <Text variant="p">Here you can find a list of all your writings.</Text>
      </PageIntro>
      <StoryList author={user} rootsOnly={false} />
    </>
  );
};

ProfileStoriesPage.Layout = ProfileLayout;

export default ProfileStoriesPage;