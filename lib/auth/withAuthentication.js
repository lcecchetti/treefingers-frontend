import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getLoginUrl } from 'lib/helper';
import { useCurrentUser } from 'lib/auth/currentUser';
import { Spinner, Container, Text } from 'components/ui';

const withAuthentication = Component => {
  const SecureComponent = props => {
    const currentUser = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
      if (!currentUser) {
        // redirect to login
        router.replace(getLoginUrl());
      }
    }, [currentUser]);

    return (currentUser ? <Component {...props} /> :
      <Container className="flex gap-sm pt-header min-h-screen items-center justify-center">
        <Spinner label="Authenticating..." />
      </Container>
    );
  };

  // propagate layout to app level in case of secure pages
  SecureComponent.Layout = Component.Layout;

  return SecureComponent;
};

export { withAuthentication };