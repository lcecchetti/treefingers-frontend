import { DefaultLayout } from 'components/layout';
import { LoginForm } from 'components/auth';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-full min-h-screen-no-header">
      <LoginForm/>
    </div>
  );
};

LoginPage.Layout = DefaultLayout;

export default LoginPage;