'use client';

import { Button } from '@/components/ui';
import { useUI } from '@/lib/ui/context';

export const ToastDemo = () => {
  const { showToast } = useUI();

  return (
    <div className="flex gap-sm">
      <Button onClick={() => showToast('Default toast')}>Default</Button>
      <Button onClick={() => showToast('Success toast', { type: 'success' })}>Success</Button>
      <Button onClick={() => showToast('Error toast', { type: 'error' })}>Error</Button>
    </div>
  );
};
