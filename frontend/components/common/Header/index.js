import { Button, Container } from 'components/ui';
import { Logo } from 'components/common';

const Header = () => {

  return (
    <Container>
      <Logo main />
      <div>
        <Button>Login</Button>
      </div>
    </Container>
  );
};

export default Header;