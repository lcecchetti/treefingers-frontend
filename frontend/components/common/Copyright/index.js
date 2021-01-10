import Link from 'next/link';

const Copyright = ({ className }) => {

  return (
    <span className={className}>
      {'© '}
      <Link color="inherit" href="/"><a>treefingers.space</a></Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </span>
  );
};

export default Copyright;