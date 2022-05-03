import { DefaultLayout } from 'components/layout';
import { ResetPasswordForm } from 'components/auth';

const ResetPasswordPage = () => {
  return (
    <div className="flex justify-center items-center min-h-full min-h-screen-no-header">
      <ResetPasswordForm/>
    </div>
  );
};

ResetPasswordPage.Layout = DefaultLayout;

export default ResetPasswordPage;