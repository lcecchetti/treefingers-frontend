import clsx from 'clsx';
import { Spinner } from 'components/ui';

const Button = ({ children, className, loading, variant = 'primary', size = 'md', as, icon, ...rest }) => {

  const Icon = icon;
  const Component = as ?? 'button';

  const style = {
    root: 'rounded-full inline-flex items-center justify-center transition-colors focus:outline-none',
    variant: {
      primary: 'bg-primary text-primary-contrast active:bg-primary-dark disabled:bg-primary-light',
      'primary-contrast': 'bg-primary-contrast text-primary',
      secondary: 'bg-secondary text-secondary-constrast active:bg-secondary-dark disabled:bg-secondary-light',
      outlined: 'bg-primary-contrast text-primary border-primary border-2 disabled:border-primary-light disabled:text-primary-light disabled:line-through active:bg-primary active:text-primary-contrast',
    },
    size: {
      sm: 'text-xs py-sm px-sm',
      md: 'py-sm px-md',
      lg: 'text-xl py-md px-xl',
    },
    iconSize: {
      sm: '',
      md: '',
      lg: 'text-2xl',
    },
  };

  return (
    <Component
      className={clsx(
        style.root,
        style.variant[variant],
        style.size[size],
        className
      )}
      {...rest}>

      {Icon &&
        <Icon className={clsx(
          'mr-sm inline-block',
          style.iconSize[size],
        )} />
      }

      {children}

      {loading &&
        <Spinner className={clsx(
          'ml-sm inline-block',
          style.iconSize[size],
        )} />
      }

    </Component>
  );
};

export default Button;
