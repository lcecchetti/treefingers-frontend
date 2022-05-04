import { DefaultLayout } from 'components/layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { getLoginUrl } from 'lib/helper/auth';
import { Spinner } from 'components/ui';
import { ApiError } from 'components/common';

const MUTATION_ACTIVATE_ACCOUNT = gql`
  mutation activateAccount($input: ActivateAccountInput!) {
    activateAccount(input: $input) {
      accountActivated
    }
  }
`;

const ActivateAccountPage = ({ token }) => {
  const router = useRouter();
  const [error, setError] = useState(false);

  const [activateAccount, { loading }] = useMutation(MUTATION_ACTIVATE_ACCOUNT, {
    onCompleted() {
      router.push(getLoginUrl());
    },
    onError(e) {
      setError(e);
    }
  });

  useEffect(() => {
    activateAccount({ variables: { input: { token } } });
  }, [])
  

  return (
    <div className="flex flex-col justify-center items-center min-h-full min-h-screen-no-header">
      <Spinner label="Activating your account..." loading={loading} />
      <ApiError error={error} />
    </div>
  );
};

export async function getStaticProps({ params: { token } }) {
  if (!token) {
    return {
      notFound: true,
    }
  }

  return {
    props: { token },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

ActivateAccountPage.Layout = DefaultLayout;

export default ActivateAccountPage;