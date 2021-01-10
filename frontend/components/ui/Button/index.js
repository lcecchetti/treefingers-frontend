import clsx from 'clsx';
import { Spinner } from 'components/ui';

const Button = ({ children, className, loading, variant, as, Icon, ...rest }) => {

  const Component = as ?? 'button';

  return (
    <Component
      class={clsx(
        'rounded-full py-2 px-4 m-1 inline-flex items-center transition-colors focus:outline-none',
        {
          ['bg-primary text-primary-contrast active:bg-primary-dark disabled:bg-primary-light']: !variant,
          ['bg-secondary text-secondary-constrast active:bg-secondary-dark disabled:bg-secondary-light']: variant === 'secondary',
          ['bg-primary-contrast text-primary border-primary border-2 disabled:border-primary-light disabled:text-primary-light active:bg-primary active:text-primary-contrast']: variant === 'outlined',
        },
        className
      )}
      {...rest}>

      {Icon &&
        <Icon className="ml-2 inline-block" />
      }

      {children}

      {loading &&
        <Spinner className="ml-2 inline-block" />
      }

    </Component>
  )
};

export default Button;
