import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { getLoginUrl } from 'lib/helper';

/**
 * Self query
 * @type {gql}
 */
const QUERY_SELF = gql`
  query self {
    self {
      id
    }
  }
`;

const withAuthentication = Page => {
  const SecurePage = props => {
    const { data } = useQuery(QUERY_SELF);
    const router = useRouter();

    useEffect(() => {
      if (!data?.self) {
        // redirect to login
        router.replace(getLoginUrl());
      }
    }, [data]);

    return (data?.self ? <Page {...props} /> : <div><p>Authenticating...</p></div> );
  }

  // propagate layout to app level
  SecurePage.Layout = Page.Layout;

  return SecurePage;
};

export default withAuthentication;