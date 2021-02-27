import ProfileSidebar from 'components/profile/ProfileSidebar';
import { withAuthentication } from 'lib/auth';

const ProfileLayout = ({ children }) => {

  return (
    <div className="pt-header min-h-screen">
      <div>
        <ProfileSidebar/>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
};

export default withAuthentication(ProfileLayout);