import { Link } from 'components/ui';
import clsx from 'clsx';

const Copyright = ({ className }) => {

  return (
    <Link className={clsx('no-underline', className)} href="/">
      © Treefingers {new Date().getFullYear()}.
    </Link>
  );
};

export default Copyright;