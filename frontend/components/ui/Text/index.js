import clsx from 'clsx';

const Text = ({ children, className, variant = 'p', as, ...rest }) => {

  // handle variant alias
  switch (variant) {
    case 'pageTitle':
      variant = 'h1';
    case 'pageSubtitle':
    case 'title':
      variant = 'h2';
      break;
    case 'subtitle':
      variant = 'h3';
      break;
  }

  // pick component
  const Component = as ?? variant;

  return (
    <Component
      class={clsx(
        {
          ['text-5xl mb-sm block']: variant === 'h1',
          ['text-3xl mb-sm block']: variant === 'h2',
          ['text-2xl mb-sm block']: variant === 'h3',
          ['text-lg mb-xs block']: ['h4', 'h5', 'h6'].includes(variant),
          ['mb-sm block']: variant === 'p',
        },
        className
      )}
      {...rest}>

      {children}
    </Component>
  );
};

export default Text;
