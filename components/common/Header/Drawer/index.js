import { useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { useUI } from 'lib/ui/context';
import { useTheme } from 'next-themes';
import { getForestsUrl } from 'lib/helper/forest';
import { ThemeIcon } from 'components/common';
import { Link, Text } from 'components/ui';

const Drawer = () => {
  const router = useRouter();
  const { isDrawerOpen, closeDrawer, getToggledTheme } = useUI();
  const { theme, setTheme } = useTheme();

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

  const drawerItems = [
    {
      label: 'FORESTS',
      href: getForestsUrl(),
      Icon: null,
      onClick: false,
    },
    {
      label: 'SWITCH THEME',
      href: '#',
      Icon: ThemeIcon,
      onClick: () => setTheme(getToggledTheme(theme)),
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
              <Link href={item.href} className="inline-flex items-center justify-center relative" onClick={item.onClick ? item.onClick : undefined}>
                <Text variant="span">{item.label}</Text>
                {!!item.Icon && <item.Icon className="absolute -right-xl" />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Drawer;