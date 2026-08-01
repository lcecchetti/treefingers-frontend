import { Container } from '@/components/ui';
import { withAuthentication } from '@/lib/auth/with-authentication';
import { ProfileSidebar } from '@/components/profile';
import { Header, Footer } from '@/components/common';
import type { ReactElement, ReactNode } from 'react';

interface ProfileLayoutProps {
  children: ReactNode;
}

const ProfileLayoutBase = ({ children }: ProfileLayoutProps): ReactElement => {
  return (
    <>
      <Header/>
      <Container className="pt-header min-h-screen">
        <div className="flex flex-col lg:flex-row gap-sm lg:gap-md">
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

export const ProfileLayout = withAuthentication(ProfileLayoutBase) as (props: ProfileLayoutProps) => ReactElement;
