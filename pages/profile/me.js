import { ProfileLayout } from 'components/layout';
import { useCurrentUser } from 'lib/auth/currentUser';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';
import { Logout } from 'components/profile';
import { UserEditForm } from 'components/user';

const ProfileMePage = () => {
  const { currentUser } = useCurrentUser();

  return (
    <>
      <PageIntro>
        <div className="flex flex-col md:flex-row gap-sm justify-between">
          <Text variant="pageTitle">{`Welcome ${currentUser.username}!`}</Text>
          <Logout/>
        </div>
        <Text variant="p">Here you can edit your profile details.</Text>
      </PageIntro>
      <UserEditForm/>
    </>
  );
};

ProfileMePage.Layout = ProfileLayout;

export default ProfileMePage;