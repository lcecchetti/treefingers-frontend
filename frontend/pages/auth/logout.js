import { DefaultLayout } from 'components/layout';
import { Logout } from 'components/auth';

const LogoutPage = () => {
  return (
    <Logout/>
  );
};

LogoutPage.Layout = DefaultLayout;

export default LogoutPage;