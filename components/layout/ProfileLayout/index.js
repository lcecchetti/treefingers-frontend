import { Container } from 'components/ui';
import { withAuthentication } from 'lib/auth/withAuthentication';

const ProfileLayout = ({ children }) => {

  return (
    <Container className="pt-header min-h-screen">
      {children}
    </Container>
  )
};

export default withAuthentication(ProfileLayout);