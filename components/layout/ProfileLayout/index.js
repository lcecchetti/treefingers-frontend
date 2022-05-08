import { Container } from 'components/ui';
import { withAuthentication } from 'lib/auth/withAuthentication';
import { ProfileSidebar } from 'components/profile';

const ProfileLayout = ({ children }) => {
  return (
    <Container className="pt-header min-h-screen">
      <div className="flex flex-col lg:flex-row gap-md">
        <ProfileSidebar className="lg:w-1/4" />
        <div className="lg:w-3/4">
          {children}
        </div>
      </div>
    </Container>
  )
};

export default withAuthentication(ProfileLayout);