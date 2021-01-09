import DefaultLayout from 'components/Layout/Default';
import Logout from 'components/Auth/Logout';

const LogoutPage = () => {
  return (
    <div>
      <Logout/>
    </div>
  );
};

LogoutPage.Layout = DefaultLayout;

export default LogoutPage;