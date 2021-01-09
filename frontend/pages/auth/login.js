import { DefaultLayout } from 'components/layout';
import { Login } from 'components/auth';

const LoginPage = () => {
  return (
    <div>
      <Login/>
    </div>
  );
};

LoginPage.Layout = DefaultLayout;

export default LoginPage;