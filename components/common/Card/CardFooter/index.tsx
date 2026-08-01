import clsx from 'clsx';

export interface CardFooterProps {
  className?: string;
  children?: React.ReactNode;
}

const CardFooter = ({ className, children }: CardFooterProps) => {
  return (
    <div className={clsx('flex justify-between items-center gap-md', className)}>
      {children}
    </div>
  );
};

export default CardFooter;
