'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUI, flyoutTypes } from '@/lib/ui/context';
import { Text } from '@/components/ui';
import { CommentList, type CommentableEntity } from '@/components/comment';
import { XIcon } from 'lucide-react';
import { StoryTree, type StoryTreeStory } from '@/components/story';
import { ForestNew } from '@/components/forest';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

interface FlyoutData {
  title?: string;
  entity?: unknown;
  callback?: (data: unknown) => void;
}

export const Flyout = () => {
  const pathname = usePathname();
  const { isFlyoutOpen, flyoutData, flyoutType, closeFlyout } = useUI();
  const data = flyoutData as FlyoutData | null;

  useEffect(() => {
    // handle body scroll lock
    if (isFlyoutOpen) {
      document.body.classList.add('flyout-open');
    } else {
      document.body.classList.remove('flyout-open');
    }

    return () => {
      document.body.classList.remove('flyout-open');
    };
  }, [isFlyoutOpen, flyoutData, flyoutType]);

  // close the flyout whenever the route changes
  useEffect(() => {
    closeFlyout();
  }, [pathname]);

  return (
    <Sheet open={isFlyoutOpen} onOpenChange={(open) => { if (!open) closeFlyout(); }}>
      <SheetContent
        forceMount
        showClose={false}
        showOverlay={false}
        className="fixed border-2 border-r-0 top-0 left-full bg-base w-full md:w-2/3 lg:w-1/3 h-screen transition-transform transform-gpu z-30 rounded-l-2xl data-[state=open]:-translate-x-full focus:outline-none"
      >
        <SheetTitle className="sr-only">{data?.title ?? 'Panel'}</SheetTitle>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center gap-sm p-md border-b-2">
            <Text variant="p" as="h3" className="uppercase text-lg font-bold">{data?.title}</Text>
            <XIcon onClick={closeFlyout} className="text-2xl cursor-pointer" />
          </div>
          {flyoutType === flyoutTypes.comments &&
            <CommentList entity={data?.entity as CommentableEntity} />
          }
          {flyoutType === flyoutTypes.tree && isFlyoutOpen &&
            <StoryTree className="h-full w-full" story={data?.entity as StoryTreeStory | undefined} />
          }
          {flyoutType === flyoutTypes.forestNew &&
            <ForestNew className="p-md overflow-auto" forest={undefined} callback={data?.callback} />
          }
        </div>
      </SheetContent>
    </Sheet>
  );
};
