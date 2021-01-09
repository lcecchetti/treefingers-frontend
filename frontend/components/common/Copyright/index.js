import Link from 'next/link';

const Copyright = () => {

  return (
    <span>
      {'© '}
      <Link color="inherit" href="/"><a>UNHOME.ME</a></Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </span>
  );
};

export default Copyright;