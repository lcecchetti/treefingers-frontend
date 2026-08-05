'use client';

import { useEffect, useRef } from 'react';
import { toast as sonnerToast } from 'sonner';
import { useUI } from '@/lib/ui/context';
import { Toaster } from '@/components/ui/sonner';
import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface ToastsProps {
  maxToasts?: number;
}

const toastClassNames = (type?: string) => ({
  toast: cn(
    '!left-0 !right-0 !mx-auto !w-fit !bg-base !border-2 !px-md !py-sm !rounded-full !flex !items-center !justify-center !gap-md !max-w-(--container-xs) !pointer-events-auto',
    type === 'error' && '!text-error',
    type === 'success' && '!text-success',
  ),
  // Sonner's default close-button styling only kicks in when the toast is
  // NOT unstyled, so we recreate a minimal version of it here to match the
  // old hand-rolled Toast's always-present close icon.
  closeButton: cn(
    '!order-last !static !ml-auto !border-0 !bg-transparent !p-0 !text-current !cursor-pointer',
    '[&>svg]:!h-4 [&>svg]:!w-4',
  ),
});

export const Toasts = ({ maxToasts = 5 }: ToastsProps) => {
  const { toasts, dismissToast } = useUI();
  const shownIds = useRef(new Set<number>());

  useEffect(() => {
    for (const toast of toasts.slice(0, maxToasts)) {
      if (shownIds.current.has(toast.id)) {
        continue;
      }
      shownIds.current.add(toast.id);

      const dismiss = () => {
        shownIds.current.delete(toast.id);
        dismissToast(toast.id);
      };

      sonnerToast(<Text>{toast.label}</Text>, {
        // Sonner treats a falsy duration as "use the default lifetime", not
        // "sticky" -- Infinity is the sentinel it actually checks for to
        // skip auto-dismissal, so translate our duration: 0 convention.
        duration: toast.duration === 0 ? Infinity : toast.duration,
        classNames: toastClassNames(toast.type),
        onDismiss: dismiss,
        onAutoClose: dismiss,
      });
    }
  }, [toasts, maxToasts, dismissToast]);

  return (
    <Toaster
      position="bottom-center"
      closeButton
      toastOptions={{ unstyled: true, classNames: toastClassNames() }}
    />
  );
};
