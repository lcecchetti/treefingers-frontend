import clsx from 'clsx';
import { Link } from 'components/ui';
import { useRouter } from 'next/router';

const Logo = ({ className, main }) => {
  const router = useRouter();

  const isHomePage = router.pathname == '/';

  const Component = isHomePage && main ? 'h1' : 'span';

  return (
      <Component className={clsx('text-3xl md:text-5xl font-serif', className)}>
        <Link href="/">
          Treefingers
        </Link>
      </Component>
  );
};

export default Logo;