import { DefaultLayout } from 'components/layout';
import { RegisterForm } from 'components/auth';
import Head from 'next/head';
import type { NextPageWithLayout } from 'lib/types/next';

const RegisterPage: NextPageWithLayout = () => {
  return (
    <div className="flex justify-center items-center min-h-screen-no-header">
      <Head>
        <title>Register | Treefingers</title>
      </Head>
      <RegisterForm/>
    </div>
  );
};

RegisterPage.Layout = DefaultLayout;

export default RegisterPage;
