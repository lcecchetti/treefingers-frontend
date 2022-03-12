import clsx from 'clsx';
import { FaSignOutAlt } from 'react-icons/fa';
import { Button, Link } from 'components/ui';
import { getLogoutUrl } from 'lib/helper/auth';

const Logout = ({ className }) => {
  return (
    <Button className={clsx('', className)} as={Link} href={getLogoutUrl()} icon={FaSignOutAlt}>
      Logout
    </Button>
  );
};

export default Logout;