import { DefaultLayout } from 'components/layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { getLoginUrl } from 'lib/helper/auth';
import { Spinner } from 'components/ui';
import { ApiError } from 'components/common';
import { useUI } from 'lib/ui/context';

const MUTATION_ACTIVATE_ACCOUNT = gql`
  mutation activateAccount($input: ActivateAccountInput!) {
    activateAccount(input: $input) {
      accountActivated
    }
  }
`;

const ActivateAccountPage = ({ token }) => {
  const router = useRouter();
  const { showToast } = useUI();

  const [activateAccount, { loading }] = useMutation(MUTATION_ACTIVATE_ACCOUNT, {
    onCompleted() {
      showToast('Your account is now active. See you around!', { type: 'success' });
      router.push(getLoginUrl());
    },
    onError(e) {
      showToast(<ApiError error={e} />, { type: 'error' });
      router.push(getLoginUrl());
    }
  });

  useEffect(() => {
    activateAccount({ variables: { input: { token } } });
  }, [])
  

  return (
    <div className="flex flex-col justify-center items-center min-h-screen-no-header">
      <Spinner label="Activating your account..." loading={loading} />
    </div>
  );
};

export async function getServerSideProps({ params: { token } }) {
  if (!token) {
    return {
      notFound: true,
    }
  }

  return {
    props: { token },
  };
}

ActivateAccountPage.Layout = DefaultLayout;

export default ActivateAccountPage;