import clsx from 'clsx';
import { assertCompositeType } from 'graphql';

const Text = ({ children, className, variant = 'p', as, ...rest }) => {

  switch (variant) {
    case 'pageTitle': 
    case 'storyViewTitle': 
      as = 'h1';
      break;
    case 'pageSubtitle': 
    case 'title': 
      as = 'h2';
      break;
    case 'subtitle': 
      as = 'h3';
      break;
  }
 
  // pick component
  const Component = as ?? variant;

  return (
    <Component
      className={clsx(
        {
          ['text-5xl md:text-6xl mb-md font-serif']: variant === 'storyViewTitle',
          ['text-5xl mb-sm font-serif']: ['h1', 'pageTitle'].includes(variant),
          ['text-2xl mb-sm']: ['h2', 'pageSubtitle'].includes(variant),
          ['text-3xl mb-sm font-serif']: ['title'].includes(variant),
          ['text-xl mb-sm']: ['h3', 'subtitle'].includes(variant),
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
