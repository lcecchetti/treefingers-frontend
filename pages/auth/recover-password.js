import { DefaultLayout } from 'components/layout';
import { RecoverPasswordForm } from 'components/auth';

const RecoverPasswordPage = () => {
  return (
    <div className="flex justify-center items-center min-h-full min-h-screen-no-header">
      <RecoverPasswordForm/>
    </div>
  );
};

RecoverPasswordPage.Layout = DefaultLayout;

export default RecoverPasswordPage;