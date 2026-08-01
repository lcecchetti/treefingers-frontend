import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getLoginUrl } from 'lib/helper/auth';
import { useCurrentUser } from 'lib/auth/currentUser';
import { Spinner, Container } from 'components/ui';
import * as gtag from 'lib/gtag';
import type { NextPageWithLayout } from 'lib/types/next';

export function withAuthentication<P extends object>(Component: NextPageWithLayout<P>): NextPageWithLayout<P> {
  const SecureComponent: NextPageWithLayout<P> = props => {
    const { currentUser, loading } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !currentUser) {
        // redirect to login
        gtag.event({
          action: 'redirect-unauthenticated',
          category: 'auth',
        });
        router.replace(getLoginUrl());
      }
    }, [!currentUser, loading]);

    // fluid/className below are explicit: Container/Spinner are still untyped .js, so TS infers these as required
    return (currentUser ? <Component {...props} /> :
      <Container className="flex gap-sm pt-header min-h-screen items-center justify-center" fluid={false}>
        <Spinner label="Authenticating..." className="" />
      </Container>
    );
  };

  // propagate layout to app level in case of secure pages
  SecureComponent.Layout = Component.Layout;

  return SecureComponent;
}
