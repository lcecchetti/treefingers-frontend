import clsx from 'clsx';

const Text = ({ children, className, variant, as, ...rest }) => {

  const Component = as ?? variant ?? 'span';

  return (
    <Component
      class={clsx(
        {
          ['mb-sm']: variant === 'p',
          ['']: variant === 'span',
        },
        className
      )}
      {...rest}>

      {children}
    </Component>
  );
};

export default Text;
