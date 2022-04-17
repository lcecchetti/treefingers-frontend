import { Container } from 'components/ui';
import { withAuthentication } from 'lib/auth/withAuthentication';

const ProfileLayout = ({ children }) => {

  return (
    <Container className="pt-header min-h-screen">
      <div className="mt-md lg:mt-0">
        {children}
      </div>
    </Container>
  )
};

export default withAuthentication(ProfileLayout);