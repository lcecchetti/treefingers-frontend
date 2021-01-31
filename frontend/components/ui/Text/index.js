import clsx from 'clsx';

const Text = ({ children, className, variant = 'p', as, ...rest }) => {

  const variantsMap = {
    pageTitle: 'h1',
    pageSubtitle: 'h2',
    title: 'h2',
    subtitle: 'h3',
    logo: 'span',
  }
 
  // pick component
  const Component = as ?? variantsMap[variant] ?? variant;

  return (
    <Component
      className={clsx(
        {
          ['text-3xl md:text-5xl']: variant === 'logo',
          ['text-3xl md:text-5xl mb-md']: variant === 'h1',
          ['text-2xl md:text-3xl mb-sm']: variant === 'h2',
          ['text-xl md:text-2xl mb-sm']: variant === 'h3',
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
