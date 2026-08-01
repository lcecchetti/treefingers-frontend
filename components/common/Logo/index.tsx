import clsx from 'clsx';
import { Link } from 'components/ui';
import { useRouter } from 'next/router';

export interface LogoProps {
  className?: string;
  main?: boolean;
}

const Logo = ({ className, main }: LogoProps) => {
  const router = useRouter();

  const isHomePage = router.pathname == '/';

  const Component = isHomePage && main ? 'h1' : 'span';

  return (
      <Component className={clsx('text-3xl lg:text-5xl font-serif', className)}>
        <Link href="/">
          Treefingers
        </Link>
      </Component>
  );
};

export default Logo;
