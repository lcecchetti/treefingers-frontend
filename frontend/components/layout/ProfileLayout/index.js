import ProfileSidebar from 'components/profile/ProfileSidebar';
import withAuthentication from 'lib/auth/withAuthentication';

const ProfileLayout = ({ children }) => {

  return (
    <div>
      <div>
        <div>
          <div>
            <ProfileSidebar/>
          </div>
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
};

export default withAuthentication(ProfileLayout);