import DefaultLayout from 'components/Layout/Default';
import Register from 'components/Auth/Register';

const RegisterPage = () => {
  return (
    <div>
      <Register />
    </div>
  );
};

RegisterPage.Layout = DefaultLayout;

export default RegisterPage;