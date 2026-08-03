'use client';

import { cn } from '@/lib/utils';
import { Search, Menu } from 'lucide-react';
import { Link } from '@/components/ui';
import { useTheme } from 'next-themes';
import { useUI } from '@/lib/ui/context';
import { getLoginUrl } from '@/lib/helper/auth';
import { getProfileMeUrl } from '@/lib/helper/profile';
import { ThemeIcon } from '@/components/common';
import { useCurrentUser } from '@/lib/auth/current-user';
import * as analytics from '@/lib/analytics';
import { CurrentUser } from '@/components/user';

interface IconListItem {
  href?: string;
  Component: React.ComponentType<{ className: string }>;
  onClick: (() => void) | false;
  showOnMobile: boolean;
  showOnDesktop: boolean;
}

export const IconList = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { toggleDrawer, getToggledTheme, openSearch } = useUI();
  const { currentUser } = useCurrentUser();

  const iconListItems: IconListItem[] = [
    {
      Component: Search,
      onClick: openSearch,
      showOnMobile: true,
      showOnDesktop: true,
    },
    {
      Component: ThemeIcon,
      onClick: () => {
        const toggledTheme = getToggledTheme(resolvedTheme ?? '');
        analytics.event({
          action: 'change-theme',
          category: 'theme',
          label: toggledTheme,
        });
        setTheme(toggledTheme);
      },
      showOnMobile: false,
      showOnDesktop: true,
    },
    {
      href: currentUser ? getProfileMeUrl() : getLoginUrl(),
      Component: CurrentUser,
      onClick: false,
      showOnMobile: true,
      showOnDesktop: true,
    },
    {
      Component: Menu,
      onClick: toggleDrawer,
      showOnMobile: true,
      showOnDesktop: false,
    },
  ];

  return (
    <ul className="flex flex-row gap-sm md:gap-md">
      {iconListItems.map((item, index) => (
        <li key={index} className={cn({
          ['hidden lg:inline-block']: !item.showOnMobile,
          ['lg:hidden']: !item.showOnDesktop,
        })}>
          <Link href={item.href ?? '#'} onClick={!!item.onClick ? (e) => { e.preventDefault(); item.onClick && item.onClick(); } : undefined}>
            <item.Component className="w-6 h-6" />
          </Link>
        </li>
      ))}
    </ul>
  );
};
