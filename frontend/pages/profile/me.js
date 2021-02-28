import { ProfileLayout } from 'components/layout';
import { useUser, withAuthentication } from 'lib/auth';

const ProfileMePage = () => {
  const user = useUser();

  return (
    <div>
      Profile me
    </div>
  );
};

ProfileMePage.Layout = ProfileLayout;

export default ProfileMePage;