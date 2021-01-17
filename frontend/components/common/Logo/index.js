import { Text, Link } from 'components/ui';
import { useRouter } from 'next/router';

const Logo = ({ className, main }) => {
  const router = useRouter();

  const isHomePage = router.pathname == '/';

  return (
    <Link href="/" styleAsLink={false}>
      <Text variant="h1" as={isHomePage && main ? 'h1' : 'span'} className={className}>
        Treefingers.space
      </Text>
    </Link>
  );
};

export default Logo;