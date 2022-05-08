import { useUI } from 'lib/ui/context';
import Toast from './Toast';

const Toasts = ({ maxToasts = 5 }) => {
  const { toasts } = useUI();

  if (!toasts) {
    return;
  }

  return (
    <div className="fixed bottom-md left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-xs p-sm">
      {toasts.slice(0, maxToasts).map((toast) => (
        <Toast key={toast._id} toast={toast} />
      ))}
    </div>
  );
};

export default Toasts;