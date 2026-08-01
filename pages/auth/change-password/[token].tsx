import { DefaultLayout } from '@/components/layout';
import { ChangePasswordForm } from '@/components/auth';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import type { NextPageWithLayout } from '@/lib/types/next';

interface ChangePasswordPageProps {
  token: string;
}

const ChangePasswordPage: NextPageWithLayout<ChangePasswordPageProps> = ({ token }) => {
  return (
    <div className="flex justify-center items-center min-h-screen-no-header">
      <Head>
        <title>Change password | Treefingers</title>
      </Head>
      <ChangePasswordForm token={token} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ChangePasswordPageProps, { token: string }> = async ({ params }) => {
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

ChangePasswordPage.Layout = DefaultLayout;

export default ChangePasswordPage;
