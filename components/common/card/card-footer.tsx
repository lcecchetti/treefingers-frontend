import clsx from 'clsx';

export interface CardFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export const CardFooter = ({ className, children }: CardFooterProps) => {
  return (
    <div className={clsx('flex justify-between items-center gap-md', className)}>
      {children}
    </div>
  );
};
