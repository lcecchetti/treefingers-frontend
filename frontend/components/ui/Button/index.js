import clsx from 'clsx';
import { Spinner } from 'components/ui';

const Button = ({ children, className, loading, variant = 'primary', size = 'md', as, icon, ...rest }) => {

  const Icon = icon;
  const Component = as ?? 'button';

  const style = {
    root: 'rounded-full inline-flex items-center justify-center transition-opacity focus:outline-none hover:opacity-90 active:opacity-100 disabled:opacity-60',
    variant: {
      primary: 'bg-primary text-primary-contrast ',
      'primary-contrast': 'bg-primary-contrast text-primary',
      outlined: 'bg-primary-contrast text-primary border-primary border-2 disabled:line-through',
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
