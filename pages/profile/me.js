import { ProfileLayout } from 'components/layout';
import { useCurrentUser } from 'lib/auth/currentUser';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';

const ProfileMePage = () => {
  const currentUser = useCurrentUser();

  return (
    <div>
      <PageIntro>
        <Text variant="pageTitle">{`Welcome ${currentUser.pseudonym}!`}</Text>
        <Text variant="p">Here you can edit your profile details.</Text>
      </PageIntro>
    </div>
  );
};

ProfileMePage.Layout = ProfileLayout;

export default ProfileMePage;