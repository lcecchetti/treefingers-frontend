import { Text, Link } from 'components/ui';

const Copyright = ({ className }) => {

  return (
    <Text variant="span" className={className}>
      {'© '}
      <Link href="/"><a>treefingers.space</a></Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Text>
  );
};

export default Copyright;