import { useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { useUI } from 'lib/ui/context';
import { useTheme } from 'next-themes';
import { getForestsUrl } from 'lib/helper/forest';
import { ThemeIcon } from 'components/common';
import { Link, Text } from 'components/ui';
import { getStoriesUrl } from 'lib/helper/story';
import { getAboutUrl } from 'lib/helper/content';
import { getAuthorsUrl } from 'lib/helper/user';
import * as gtag from 'lib/gtag';

interface DrawerItem {
  label: string;
  href?: string;
  Icon: React.ComponentType<{ className?: string }> | null;
  onClick: (() => void) | false;
}

const Drawer = () => {
  const router = useRouter();
  const { isDrawerOpen, closeDrawer, getToggledTheme } = useUI();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // handle body scroll lock
    if (isDrawerOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }

    // close drawer on route change
    router.events.on('routeChangeStart', closeDrawer);

    // clean up
    return () => {
      document.body.classList.remove('drawer-open');
      router.events.off('routeChangeStart', closeDrawer);
    };
  }, [isDrawerOpen]);

  const drawerItems: DrawerItem[] = [
    {
      label: 'HOME',
      href: '/',
      Icon: null,
      onClick: false,
    },
    {
      label: 'FORESTS',
      href: getForestsUrl(),
      Icon: null,
      onClick: false,
    },
    {
      label: 'STORIES',
      href: getStoriesUrl(),
      Icon: null,
      onClick: false,
    },
    {
      label: 'AUTHORS',
      href: getAuthorsUrl(),
      Icon: null,
      onClick: false,
    },
    {
      label: 'ABOUT',
      href: getAboutUrl(),
      Icon: null,
      onClick: false,
    },
    {
      label: 'THEME',
      Icon: ThemeIcon,
      onClick: () => {
        const toggledTheme = getToggledTheme(resolvedTheme ?? '');
        gtag.event({
          action: 'change-theme',
          category: 'theme',
          label: toggledTheme,
        });
        setTheme(toggledTheme);
      },
    },
  ];

  return (
    <div className={clsx(
      'fixed lg:hidden top-header left-full bg-primary w-full h-screen-no-header transition-transform transform-gpu z-40',
      {
        ['-translate-x-full']: isDrawerOpen,
      }
    )}>
      <div className="h-full flex flex-col justify-center">
        <ul className="p-md flex flex-col overflow-y-auto">
          {drawerItems.map((item, index) => (
            <li key={index} className="text-primary-contrast text-xl py-sm text-center">
              <Link href={item.href ?? '#'} className="inline-flex items-center justify-center relative" onClick={item.onClick ? item.onClick : undefined}>
                <Text>{item.label}</Text>
                {!!item.Icon && <item.Icon className="ml-sm" />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
