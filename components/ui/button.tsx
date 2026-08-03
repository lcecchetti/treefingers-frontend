import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

export const buttonVariants = cva(
  'rounded-full inline-flex gap-sm items-center justify-center transition-opacity focus:outline-none hover:opacity-90 active:opacity-100 disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-contrast',
        'primary-contrast': 'bg-primary-contrast text-primary',
        outlined: 'bg-primary-contrast text-primary border-primary border-2 disabled:line-through',
      },
      size: {
        xs: 'text-xs p-xs',
        sm: 'text-sm p-sm',
        md: 'text-md py-sm px-md',
        lg: 'text-xl py-md px-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const iconSizeClass: Record<'xs' | 'sm' | 'md' | 'lg', string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
};

export type ButtonProps<C extends React.ElementType = 'button'> = {
  as?: C;
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
} & VariantProps<typeof buttonVariants>
  & Omit<React.ComponentPropsWithoutRef<C>, 'as' | 'className' | 'children'>;

export const Button = <C extends React.ElementType = 'button'>({
  children,
  className,
  loading = false,
  variant = 'primary',
  size = 'md',
  as,
  icon,
  ...rest
}: ButtonProps<C>) => {
  const Icon = icon;
  const Component = as ?? 'button';
  const resolvedSize = size ?? 'md';

  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}>

      {Icon &&
        <Icon className={cn('inline-block', iconSizeClass[resolvedSize])} />
      }

      {children}

      <Spinner
        className={cn('inline-block', iconSizeClass[resolvedSize])}
        loading={loading}
      />

    </Component>
  );
};
