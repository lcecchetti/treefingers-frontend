import clsx from 'clsx';

const Text = ({ children, className, variant = 'span', as, ...rest }) => {

  if (!as) {
    switch (variant) {
      case 'pageTitle': 
      case 'storyTitle': 
        as = 'h1';
        break;
      case 'pageSubtitle': 
      case 'title':
        as = 'h2';
        break;
      case 'subtitle': 
        as = 'h3';
        break;
      case 'error': 
      case 'success':
        as = 'span';
        break;
    }
  }
  
  // pick component
  const Component = as || variant;

  return (
    <Component
      className={clsx(
        {
          ['text-4xl lg:text-5xl font-serif font-bold']: ['storyTitle'].includes(variant),
          ['text-4xl font-serif font-bold']: ['h1', 'pageTitle'].includes(variant),
          ['text-3xl font-serif font-bold']: ['title'].includes(variant),
          ['text-2xl font-serif font-bold']: ['h2', 'pageSubtitle'].includes(variant),
          ['text-xl font-serif font-bold']: ['h3', 'subtitle'].includes(variant),
          ['text-lg font-serif font-bold']: ['h4', 'h5', 'h6'].includes(variant),
          ['block']: variant === 'p',
          ['text-error']: variant === 'error',
          ['text-success']: variant === 'error',
        },
        className
      )}
      {...rest}>

      {children}
    </Component>
  );
};

export default Text;
