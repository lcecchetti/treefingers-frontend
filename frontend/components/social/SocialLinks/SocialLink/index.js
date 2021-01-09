import Link from 'next/link';

const SocialLink = ({ label, href, Icon }) => {

  return (
    <li>
      <Link href={href}>
        <a><Icon /></a>
      </Link>
    </li>
  );
};

export default SocialLink;