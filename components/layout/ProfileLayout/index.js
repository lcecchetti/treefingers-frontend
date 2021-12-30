import ProfileSidebar from 'components/profile/ProfileSidebar';
import { Container } from 'components/ui';
import { withAuthentication } from 'lib/auth/withAuthentication';

const ProfileLayout = ({ children }) => {

  return (
    <Container className="pt-header min-h-screen">
      <div className="my-sm flex flex-col md:flex-row gap-md">
        <ProfileSidebar className="md:w-1/4" />
        <div className="md:w-3/4">
          {children}
        </div>
      </div>
    </Container>
  )
};

export default withAuthentication(ProfileLayout);