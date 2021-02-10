import clsx from 'clsx';

const Text = ({ children, className, variant = 'p', as, ...rest }) => {

  switch (variant) {
    case 'pageTitle': 
      variant = 'h1';
      break;
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
      className={clsx(
        {
          ['text-4xl mb-sm']: variant === 'h1',
          ['text-2xl mb-sm']: variant === 'h2',
          ['text-xl mb-sm']: variant === 'h3',
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
