'use client';

import { Button, Link, Text } from '@/components/ui';
import clsx from 'clsx';
import { getProfileMeUrl, getProfileDetailsUrl, getProfileMyStories, getProfileMyForests, getProfileMyChapters, getProfileLikedStories, getProfileLikedChapters, getProfileFollowedUsers, getProfileJoinedForests } from '@/lib/helper/profile';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

interface NavItem {
  label: string;
  href: string;
  Icon?: React.ComponentType<{ className?: string }>;
}

const navData: NavItem[] = [
  {
    'label': 'What\'s new',
    'href': getProfileMeUrl(),
  },
  {
    'label': 'My details',
    'href': getProfileDetailsUrl(),
  },
  {
    'label': 'My stories',
    'href': getProfileMyStories(),
  },
  {
    'label': 'My chapters',
    'href': getProfileMyChapters(),
  },
  {
    'label': 'My forests',
    'href': getProfileMyForests(),
  },
  {
    'label': 'Liked stories',
    'href': getProfileLikedStories(),
  },
  {
    'label': 'Liked chapters',
    'href': getProfileLikedChapters(),
  },
  {
    'label': 'Followed users',
    'href': getProfileFollowedUsers(),
  },
  {
    'label': 'Joined forests',
    'href': getProfileJoinedForests(),
  },
];

interface ProfileSidebarProps {
  className?: string;
}

export const ProfileSidebar = ({ className }: ProfileSidebarProps) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={clsx('flex flex-col gap-sm mt-sm lg:mt-md', className)}>
      <Button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} icon={FaBars}>Profile Menu</Button>
      <ul className={clsx('flex-col gap-px overflow-hidden',
        !menuOpen && 'max-h-0 lg:max-h-full',
      )}>
        {navData.map((item, index) => (
          <li key={index} className={clsx('border-2 relative rounded-md',
            pathname !== item.href && 'border-primary-contrast bg-primary text-primary-contrast',
            pathname === item.href && 'border-primary bg-primary-contrast text-primary',
          )}>
            <Link href={item.href} className="flex items-center">
              <Text variant="span" className="uppercase my-xs font-bold text-sm block py-sm px-md w-full" onClick={() => setMenuOpen(false)}>{item.label}</Text>
              {item.Icon &&
                <item.Icon className="text-xl" />
              }
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
