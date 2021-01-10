import clsx from 'clsx';
import { CgSpinner } from 'react-icons/cg';

const Spinner = ({ className }) => {

  return (
    <CgSpinner className={clsx('animate-spin', className)} />
  )
};

export default Spinner;

