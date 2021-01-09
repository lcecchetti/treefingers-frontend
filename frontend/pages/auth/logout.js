import { DefaultLayout } from 'components/layout';
import { Logout } from 'components/auth';

const LogoutPage = () => {
  return (
    <div>
      <Logout/>
    </div>
  );
};

LogoutPage.Layout = DefaultLayout;

export default LogoutPage;