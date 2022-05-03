import { DefaultLayout } from 'components/layout';
import { ForgotPasswordForm } from 'components/auth';

const ForgotPasswordPage = () => {
  return (
    <div className="flex justify-center items-center min-h-full min-h-screen-no-header">
      <ForgotPasswordForm/>
    </div>
  );
};

ForgotPasswordPage.Layout = DefaultLayout;

export default ForgotPasswordPage;