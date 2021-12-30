import { Link } from 'components/ui';

const Copyright = ({ className }) => {

  return (
    <Link className={className} href="/">
      © Treefingers {new Date().getFullYear()}.
    </Link>
  );
};

export default Copyright;