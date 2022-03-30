import { useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { useUI, flyoutTypes } from 'lib/ui/context';
import { Text } from 'components/ui';
import { CommentList } from 'components/comment';
import { FaTimes } from 'react-icons/fa'
import { StoryTree } from 'components/story';

const Flyout = () => {
  const router = useRouter();
  const { isFlyoutOpen, flyoutData, flyoutType, closeFlyout } = useUI();

  useEffect(() => {
    // handle body scroll lock
    if (isFlyoutOpen) {
      document.body.classList.add('flyout-open');
    } else {
      document.body.classList.remove('flyout-open');
    }

    // close drawer on route change
    router.events.on('routeChangeStart', closeFlyout);

    // clean up
    return () => {
      document.body.classList.remove('flyout-open');
      router.events.off('routeChangeStart', closeFlyout);
    };
  }, [isFlyoutOpen, flyoutData, flyoutType]);

  return (
    <div className={clsx(
      'fixed sm:border-l-2 top-0 left-full bg-base w-full sm:w-2/3 lg:w-1/3 h-screen transition-transform transform-gpu z-30',
      {
        ['-translate-x-full']: isFlyoutOpen,
      }
    )}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center gap-sm p-md border-b-2">
          <Text variant="h3" className="uppercase">{flyoutData?.title}</Text>
          <FaTimes onClick={closeFlyout} className="text-2xl cursor-pointer"/>
        </div>
        {flyoutType === flyoutTypes.comments && 
          <CommentList entity={flyoutData.entity} />
        }
        {flyoutType === flyoutTypes.tree && 
          <StoryTree className="h-full w-full" story={flyoutData.entity} />
        }
      </div>
    </div>
  );
};

export default Flyout;