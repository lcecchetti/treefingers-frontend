import { ProfileLayout } from 'components/layout';
import { useUser } from 'lib/auth';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';

const ProfileMePage = () => {
  const user = useUser();

  return (
    <div>
      <PageIntro title={`Welcome ${user.username}!`}>
        <Text variant="h3"></Text>
        <Text variant="p">Here you can edit your profile details.</Text>
      </PageIntro>
    </div>
  );
};

ProfileMePage.Layout = ProfileLayout;

export default ProfileMePage;