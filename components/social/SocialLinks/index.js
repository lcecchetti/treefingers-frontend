import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'components/ui';

const socials = [
  {
    label: 'facebook',
    Icon: FaFacebook,
    href: 'https://www.facebook.com/treefingers.co/',
  },
  {
    label: 'twitter',
    Icon: FaTwitter,
    href: 'https://twitter.com/TreefingersCo',
  },
  {
    label: 'instagram',
    Icon: FaInstagram,
    href: 'https://www.instagram.com/treefingers.co/',
  },
];

const SocialLinks = () => {
  return (
    <ul className="flex justify-between gap-md">
      {socials.map(({ href, Icon }, index) => (
        <li key={index}>
          <Link href={href} target="_blank">
            <Icon className="text-2xl" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SocialLinks;