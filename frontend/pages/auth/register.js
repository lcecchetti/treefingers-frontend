import { DefaultLayout } from 'components/layout';
import { Register } from 'components/auth';

const RegisterPage = () => {
  return (
    <div>
      <Register />
    </div>
  );
};

RegisterPage.Layout = DefaultLayout;

export default RegisterPage;