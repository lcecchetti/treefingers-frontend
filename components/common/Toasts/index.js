import { useUI } from 'lib/ui/context';
import Toast from './Toast';

const Toasts = ({ maxToasts = 5 }) => {
  const { toasts } = useUI();

  return (!!toasts.length &&
    <div className="fixed bottom-md z-50 flex flex-col items-center gap-xs p-sm w-full pointer-events-none">
      {toasts.slice(0, maxToasts).map((toast) => (
        <Toast key={toast._id} toast={toast} />
      ))}
    </div>
  );
};

export default Toasts;