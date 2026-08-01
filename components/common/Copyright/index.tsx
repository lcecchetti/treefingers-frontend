import { Link } from 'components/ui';

export interface CopyrightProps {
  className?: string;
}

const Copyright = ({ className }: CopyrightProps) => {

  return (
    <Link className={className} href="/">
      © Treefingers {new Date().getFullYear()}.
    </Link>
  );
};

export default Copyright;
