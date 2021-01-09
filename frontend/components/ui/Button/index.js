import clsx from 'clsx';
import { Spinner } from 'components/ui';

const Button = ({ children, className, loading, variant, disabled }) => {

  return (
    <button 
      class={clsx('', className)} 
      disabled={disabled}>

      {children}

      {loading &&
        <Spinner />
      }

    </button>
  )
};

export default Button;

