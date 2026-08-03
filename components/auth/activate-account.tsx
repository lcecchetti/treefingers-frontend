'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { graphql } from '@/lib/graphql/generated';
import { getLoginUrl } from '@/lib/helper/auth';
import { Spinner } from '@/components/ui';
import { ApiError } from '@/components/common';
import { useUI } from '@/lib/ui/context';

const MUTATION_ACTIVATE_ACCOUNT = graphql(`
  mutation activateAccount($input: ActivateAccountInput!) {
    activateAccount(input: $input) {
      result
    }
  }
`);

interface ActivateAccountProps {
  token: string;
}

export const ActivateAccount = ({ token }: ActivateAccountProps) => {
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
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen-no-header">
      <Spinner label="Activating your account..." loading={loading} />
    </div>
  );
};
