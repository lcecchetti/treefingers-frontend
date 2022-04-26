import clsx from 'clsx';
import Spinner from 'components/ui/Spinner';

const Button = ({ children, className, loading = false, variant = 'primary', size = 'md', as, icon, ...rest }) => {

  const Icon = icon;
  const Component = as ?? 'button';

  const style = {
    root: 'rounded-full inline-flex gap-sm items-center justify-center transition-opacity focus:outline-none hover:opacity-90 active:opacity-100 disabled:opacity-60',
    variant: {
      primary: 'bg-primary text-primary-contrast ',
      'primary-contrast': 'bg-primary-contrast text-primary',
      outlined: 'bg-primary-contrast text-primary border-primary border-2 disabled:line-through',
    },
    size: {
      sm: 'text-sm p-sm',
      md: 'text-md py-sm px-md',
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
          'inline-block',
          style.iconSize[size],
        )} />
      }

      {children}

      <Spinner className={clsx(
          'inline-block',
          style.iconSize[size],
        )} 
        loading={loading}/>

    </Component>
  );
};

export default Button;
