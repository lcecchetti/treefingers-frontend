import { Container } from '@/components/ui';
import { Copyright } from '@/components/common';
import { SocialLinks } from '@/components/social';

export interface FooterProps {}

export const Footer = () => {

  return (
    <Container className="flex justify-between py-md">
      <SocialLinks />
      <Copyright />
    </Container>
  );
};
