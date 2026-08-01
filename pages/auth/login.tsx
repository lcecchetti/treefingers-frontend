import { DefaultLayout } from 'components/layout';
import { LoginForm } from 'components/auth';
import Head from 'next/head';
import type { NextPageWithLayout } from 'lib/types/next';

const LoginPage: NextPageWithLayout = () => {
  return (
    <div className="flex justify-center items-center min-h-screen-no-header">
      <Head>
        <title>Login | Treefingers</title>
      </Head>
      <LoginForm/>
    </div>
  );
};

LoginPage.Layout = DefaultLayout;

export default LoginPage;
