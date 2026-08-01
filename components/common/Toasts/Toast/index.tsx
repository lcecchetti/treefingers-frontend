import { useUI, ToastData } from 'lib/ui/context';
import { Text } from 'components/ui';
import { FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export interface ToastProps {
  toast: ToastData;
}

const Toast = ({ toast }: ToastProps) => {
  const [shown, setShown] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const { dismissToast } = useUI();

  useEffect(() => {
    if (!toast.duration) {
      return;
    }

    const timeoutDismissing = setTimeout(() => setDismissing(true), toast.duration - 150);
    const timeoutDismissed = setTimeout(() => dismissToast(toast.id), toast.duration);

    return () => {
      clearTimeout(timeoutDismissing);
      clearTimeout(timeoutDismissed);
    }
  }, [])

  useEffect(() => {
    setShown(true);
  });

  return (
    <div className={clsx(
      'bg-base border-2 px-md py-sm rounded-full transition-[transform,opacity] flex justify-between items-center gap-md max-w-xs pointer-events-auto',
      !shown && 'translate-y-full opacity-0',
      dismissing && 'opacity-0',
      toast.type === 'error' && 'text-error',
      toast.type === 'success' && 'text-success',
    )}>
      <Text>{toast.label}</Text>
      <FaTimes className="cursor-pointer text-lg" onClick={() => dismissToast(toast.id)} />
    </div>
  );
};

export default Toast;
