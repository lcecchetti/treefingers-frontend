import { DefaultLayout } from 'components/layout';
import { ChangePasswordForm } from 'components/auth';

const ChangePasswordPage = ({ user, token }) => {
  return (
    <div className="flex justify-center items-center min-h-full min-h-screen-no-header">
      <ChangePasswordForm user={user} token={token} />
    </div>
  );
};

export async function getStaticProps({ params: { user, token } }) {
  if (!user || !token) {
    return {
      notFound: true,
    }
  }

  return {
    props: { user, token },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

ChangePasswordPage.Layout = DefaultLayout;

export default ChangePasswordPage;