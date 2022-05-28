import { Container } from 'components/ui';
import { withAuthentication } from 'lib/auth/withAuthentication';
import { ProfileSidebar } from 'components/profile';
import { Header, Footer } from 'components/common';

const ProfileLayout = ({ children }) => {
  return (
    <>
      <Header/>
      <Container className="pt-header min-h-screen">
        <div className="flex flex-col lg:flex-row gap-md">
          <ProfileSidebar className="lg:w-1/4" />
          <div className="lg:w-3/4">
            {children}
          </div>
        </div>
      </Container>
      <Footer/>
    </>
  )
};

export default withAuthentication(ProfileLayout);