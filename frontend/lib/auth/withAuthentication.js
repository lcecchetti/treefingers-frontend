import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getLoginUrl } from 'lib/helper';
import { useUser } from 'lib/auth';
import { Spinner, Container, Text } from 'components/ui';

const withAuthentication = Component => {
  const SecureComponent = props => {
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        // redirect to login
        router.replace(getLoginUrl());
      }
    }, [user]);

    return (user ? <Component {...props} /> :
      <Container className="flex gap-sm pt-header min-h-screen items-center justify-center">
        <Text variant="span">Authenticating...</Text>
        <Spinner />
      </Container>
    );
  };

  // propagate layout to app level in case of secure pages
  SecureComponent.Layout = Component.Layout;

  return SecureComponent;
};

export { withAuthentication };