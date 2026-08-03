import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.ComponentPropsWithoutRef<'textarea'>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border-primary w-full rounded-xl focus:outline-none focus:ring-0 bg-primary-contrast focus:border-primary',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
