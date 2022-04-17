import { DefaultLayout } from 'components/layout';
import { RegisterForm } from 'components/auth';

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center min-h-full min-h-screen-no-header">
      <RegisterForm/>
    </div>
  );
};

RegisterPage.Layout = DefaultLayout;

export default RegisterPage;