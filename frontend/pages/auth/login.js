import DefaultLayout from 'components/Layout/Default';
import Login from 'components/Auth/Login';

const LoginPage = () => {
  return (
    <div>
      <Login/>
    </div>
  );
};

LoginPage.Layout = DefaultLayout;

export default LoginPage;