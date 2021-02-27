import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getLoginUrl } from 'lib/helper';
import { getAuthToken, useUser } from 'lib/auth';


const withAuthentication = Page => {
  const SecurePage = props => {
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        // redirect to login
        router.replace(getLoginUrl());
      }
    }, [user, getAuthToken()]);

    return (user ? <Page {...props} /> : <div><p>Authenticating...</p></div> );
  }

  // propagate layout to app level
  SecurePage.Layout = Page.Layout;

  return SecurePage;
};

export { withAuthentication };