import clsx from 'clsx';

export type TextVariant =
  | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'pageTitle' | 'storyTitle' | 'pageSubtitle' | 'title' | 'subtitle' | 'label' | 'error' | 'success';

export type TextProps<C extends React.ElementType = 'span'> = {
  as?: C;
  variant?: TextVariant;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<C>, 'as' | 'className' | 'children'>;

export const Text = <C extends React.ElementType = 'span'>({ children, className, variant = 'span', as, ...rest }: TextProps<C>) => {

  let tag: React.ElementType | undefined = as;

  if (!tag) {
    switch (variant) {
      case 'pageTitle':
      case 'storyTitle':
        tag = 'h1';
        break;
      case 'pageSubtitle':
      case 'title':
        tag = 'h2';
        break;
      case 'subtitle':
        tag = 'h3';
        break;
      case 'error':
      case 'success':
        tag = 'span';
        break;
    }
  }

  // pick component
  const Component = tag || (variant as React.ElementType);

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
          ['text-success']: variant === 'success',
        },
        className
      )}
      {...rest}>

      {children}
    </Component>
  );
};
