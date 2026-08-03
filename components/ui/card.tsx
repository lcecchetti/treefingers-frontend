import { cn } from '@/lib/utils';

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export const Card = ({ className, children }: CardProps) => (
  <div className={cn('rounded-2xl p-lg flex flex-col gap-md justify-between', className)}>
    {children}
  </div>
);

export const CardHeader = ({ className, children }: CardProps) => (
  <div className={cn('flex justify-between items-center gap-md', className)}>
    {children}
  </div>
);

export const CardContent = ({ className, children }: CardProps) => (
  <div className={cn('flex flex-col items-center gap-md grow', className)}>
    {children}
  </div>
);

export const CardFooter = ({ className, children }: CardProps) => (
  <div className={cn('flex justify-between items-center gap-md', className)}>
    {children}
  </div>
);
