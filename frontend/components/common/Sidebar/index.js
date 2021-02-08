import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useUI } from 'lib/ui/context';

const Sidebar = () => {

  const { isSidebarOpen, disableBodyScroll, enableBodyScroll } = useUI();

  useEffect(() => {
    if (isSidebarOpen) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
    return () => {
      enableBodyScroll();
    };
  }, [isSidebarOpen]);

  return (
    <div className={clsx(
        'fixed md:hidden top-header left-full bg-primary w-full min-h-screen-no-header transition-transform transform-gpu',
        {
          ['-translate-x-full']: isSidebarOpen,
        }
      )}>

    </div>
  );
};

export default Sidebar;