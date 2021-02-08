import clsx from 'clsx';
import { useUI } from 'lib/ui/context';

const DefaultLayout = ({ children }) => {

  return (
    <div className="pt-header min-h-screen">
      {children}
    </div>
  )
};

export default DefaultLayout;