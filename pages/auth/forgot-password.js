import { DefaultLayout } from 'components/layout';
import { ForgotPasswordForm } from 'components/auth';
import Head from 'next/head';

const ForgotPasswordPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen-no-header">
      <Head>
        <title>Forgot password | Treefingers</title>
      </Head>
      <ForgotPasswordForm/>
    </div>
  );
};

ForgotPasswordPage.Layout = DefaultLayout;

export default ForgotPasswordPage;