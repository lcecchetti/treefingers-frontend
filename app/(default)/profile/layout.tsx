'use client';

import { Container } from '@/components/ui';
import { WithAuthentication } from '@/lib/auth/with-authentication';
import { ProfileSidebar } from '@/components/profile';
import type { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <WithAuthentication>
      <Container className="min-h-screen">
        <div className="flex flex-col lg:flex-row gap-sm lg:gap-md">
          <ProfileSidebar className="lg:w-1/4" />
          <div className="lg:w-3/4">
            {children}
          </div>
        </div>
      </Container>
    </WithAuthentication>
  );
}
