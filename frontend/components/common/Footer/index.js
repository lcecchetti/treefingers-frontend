import { Container } from 'components/ui';
import { Copyright } from 'components/common';
import { SocialLinks } from 'components/social';

const Footer = () => {

  return (
    <Container className="flex justify-between py-md mt-md">
      <SocialLinks />
      <Copyright />
    </Container>
  );
};

export default Footer;