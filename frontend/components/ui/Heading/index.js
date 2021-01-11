import clsx from 'clsx';

const Heading = ({ children, className, variant, as, ...rest }) => {

  // pick variant
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
  const Component = as ?? variant ?? 'h1';

  return (
    <Component
      class={clsx(
        '',
        {
          ['text-5xl mb-2']: variant === 'h1',
          ['text-3xl mb-2']: variant === 'h2',
          ['text-2xl mb-2']: variant === 'h3',
          ['text-lg mb-1']: ['h4, h5, h6'].includes(variant),
        },
        className
      )}
      {...rest}>

      {children}
    </Component>
  )
};

export default Heading;
