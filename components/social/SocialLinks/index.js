import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'components/ui';
import * as gtag from 'lib/gtag';

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
      {socials.map(({ href, label, Icon }, index) => (
        <li key={index}>
          <Link href={href} onClick={() => {
            gtag.event({
              action: 'social-icon-click',
              category: 'social',
              label,
            });
            location.href = href;
          }}>
            <Icon className="text-2xl" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SocialLinks;