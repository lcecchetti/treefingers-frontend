'use client';

import { Suspense } from 'react';
import { useCurrentUser } from '@/lib/auth/current-user';
import { Text, Button, Link } from '@/components/ui';
import { getLoginUrl } from '@/lib/helper/auth';
import { usePathname, useSearchParams } from 'next/navigation';

interface AuthRequiredProps {
  children: React.ReactNode;
  text?: string;
}

const AuthRequiredContent = ({ children, text }: AuthRequiredProps) => {
  const { currentUser } = useCurrentUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const asPath = search ? `${pathname}?${search}` : pathname;

  text = text ?? "Hey, it looks like you are not logged in. Login or create an account and you'll be ready to go.";

  return (
    <>
      {!currentUser &&
        <div className="my-md flex flex-col gap-sm items-center p-lg border-t-2 border-b-2">
          <Text variant="p">{text}</Text>
          <Button as={Link} href={getLoginUrl(asPath)}>Login / Register</Button>
        </div>
      }

      {currentUser &&
        children
      }
    </>
  );
};

export const AuthRequired = (props: AuthRequiredProps) => (
  <Suspense fallback={null}>
    <AuthRequiredContent {...props} />
  </Suspense>
);
