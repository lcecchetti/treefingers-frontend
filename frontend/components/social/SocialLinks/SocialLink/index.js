import { Link } from 'components/ui';

const SocialLink = ({ href, Icon }) => {

  return (
    <li>
      <Link href={href}>
        <Icon className="text-2xl" />
      </Link>
    </li>
  );
};

export default SocialLink;