import { ProfileLayout } from 'components/layout';
import { useCurrentUser } from 'lib/auth/currentUser';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';

const ProfileMePage = () => {
  const currentUser = useCurrentUser();

  return (
    <PageIntro>
      <Text variant="pageTitle">{`Welcome ${currentUser.username}!`}</Text>
      <Text variant="p">Here you can edit your profile details.</Text>
    </PageIntro>
  );
};

ProfileMePage.Layout = ProfileLayout;

export default ProfileMePage;