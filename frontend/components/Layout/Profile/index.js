import ProfileSidebar from 'components/Profile/Sidebar';
import withAuthentication from 'lib/auth/withAuthentication';

const LayoutProfile = ({ children }) => {

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

export default withAuthentication(LayoutProfile);