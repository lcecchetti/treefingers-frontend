import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'components/ui';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

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
  const { showToast } = useUI();

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
            showToast(`We're not on ${label} yet, but we'll be soon!`);
            //location.href = href;
          }}>
            <Icon className="text-2xl" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SocialLinks;