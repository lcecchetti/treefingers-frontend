import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import SocialLink from './SocialLink';

const socials = [
  {
    label: 'facebook',
    Icon: FaFacebook,
    href: '/#',
  },
  {
    label: 'twitter',
    Icon: FaTwitter,
    href: '/#',
  },
  {
    label: 'instagram',
    Icon: FaInstagram,
    href: '/#',
  },
];

const SocialLinks = () => {

  return (
    <ul className="flex justify-between gap-md">
      {socials.map((socialProps, index) => (
        <SocialLink key={index} {...socialProps} />
      ))}
    </ul>
  );
};

export default SocialLinks;