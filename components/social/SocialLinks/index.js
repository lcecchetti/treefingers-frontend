import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'components/ui';

const socials = [
  {
    label: 'facebook',
    Icon: FaFacebook,
    href: '#',
  },
  {
    label: 'twitter',
    Icon: FaTwitter,
    href: '#',
  },
  {
    label: 'instagram',
    Icon: FaInstagram,
    href: '#',
  },
];

const SocialLinks = () => {

  return (
    <ul className="flex justify-between gap-md">
      {socials.map((social, index) => (
        <li key={index}>
          <Link href={social.href}>
            <social.Icon className="text-2xl" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SocialLinks;