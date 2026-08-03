import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type TextVariant =
  | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'pageTitle' | 'storyTitle' | 'pageSubtitle' | 'title' | 'subtitle' | 'label' | 'error' | 'success';

const textVariants = cva('', {
  variants: {
    variant: {
      span: '',
      p: 'block',
      h1: 'text-4xl font-serif font-bold',
      h2: 'text-2xl font-serif font-bold',
      h3: 'text-xl font-serif font-bold',
      h4: 'text-lg font-serif font-bold',
      h5: 'text-lg font-serif font-bold',
      h6: 'text-lg font-serif font-bold',
      pageTitle: 'text-4xl font-serif font-bold',
      storyTitle: 'text-4xl lg:text-5xl font-serif font-bold',
      pageSubtitle: 'text-2xl font-serif font-bold',
      title: 'text-3xl font-serif font-bold',
      subtitle: 'text-xl font-serif font-bold',
      label: '',
      error: 'text-error',
      success: 'text-success',
    },
  },
  defaultVariants: {
    variant: 'span',
  },
});

const defaultTagByVariant: Partial<Record<TextVariant, React.ElementType>> = {
  pageTitle: 'h1',
  storyTitle: 'h1',
  pageSubtitle: 'h2',
  title: 'h2',
  subtitle: 'h3',
  error: 'span',
  success: 'span',
};

export type TextProps<C extends React.ElementType = 'span'> = {
  as?: C;
  variant?: TextVariant;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<C>, 'as' | 'className' | 'children'>;

export const Text = <C extends React.ElementType = 'span'>({
  children,
  className,
  variant = 'span',
  as,
  ...rest
}: TextProps<C>) => {
  const Component = as ?? defaultTagByVariant[variant] ?? (variant as React.ElementType);

  return (
    <Component className={cn(textVariants({ variant }), className)} {...rest}>
      {children}
    </Component>
  );
};
