import { DefaultLayout } from 'components/layout';
import { ChangePasswordForm } from 'components/auth';
import Head from 'next/head';

const ChangePasswordPage = ({ token }) => {
  return (
    <div className="flex justify-center items-center min-h-screen-no-header">
      <Head>
        <title>Change password | Treefingers</title>
      </Head>
      <ChangePasswordForm token={token} />
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

ChangePasswordPage.Layout = DefaultLayout;

export default ChangePasswordPage;