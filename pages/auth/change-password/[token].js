import { DefaultLayout } from 'components/layout';
import { ChangePasswordForm } from 'components/auth';

const ChangePasswordPage = ({ token }) => {
  return (
    <div className="flex justify-center items-center min-h-screen-no-header">
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