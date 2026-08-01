import { DefaultLayout } from 'components/layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { getLoginUrl } from 'lib/helper/auth';
import { Spinner } from 'components/ui';
import { ApiError } from 'components/common';
import { useUI } from 'lib/ui/context';
import type { GetServerSideProps } from 'next';
import type { NextPageWithLayout } from 'lib/types/next';

const MUTATION_ACTIVATE_ACCOUNT = graphql(`
  mutation activateAccount($input: ActivateAccountInput!) {
    activateAccount(input: $input) {
      result
    }
  }
`);

interface ActivateAccountPageProps {
  token: string;
}

const ActivateAccountPage: NextPageWithLayout<ActivateAccountPageProps> = ({ token }) => {
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

export const getServerSideProps: GetServerSideProps<ActivateAccountPageProps, { token: string }> = async ({ params }) => {
  const token = params?.token;

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
